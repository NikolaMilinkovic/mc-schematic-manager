/* eslint-disable max-len */
import React, {
  useEffect, useState, useRef, useReducer,
} from 'react';
import './editSchematic.scss';
import { v4 as uuid } from 'uuid';
import { useParams } from 'react-router-dom';
import { notifySuccess, notifyError, notifyInfo } from '../../util-components/Notifications';
import TagsInput from '../../util-components/TagsInput';
import FormInput from '../../util-components/FormInput';
import 'react-toastify/dist/ReactToastify.css';
import FileInput from '../../util-components/fileInputComponent/FileInputComponent';
import ImgInputComponent from '../../util-components/imgInputComponent/ImgInputComponent';
import customFetch from '../../../fetchMethod';
import encodeImageToBlurHash from '../../../util-methods/encodeToBlurHash';
import imageCompressor from '../../../util-methods/imageCompressor';
import CollectionsPicker from '../../util-components/collectionsPicker/CollectionsPicker';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

// Method used for rerendering the file input text
const initialState = 0;
function reducer(state, action) {
  switch (action.type) {
    case 'reset':
      return state + 1; // Increment the state to force a re-render
    default:
      return state;
  }
}

function EditSchematic() {
  const { id } = useParams();
  const [schematic, setSchematic] = useState();
  const [tags, setTags] = useState([]);
  const [schematicName, setSchematicName] = useState('');
  const [tagAutocomplete, setTagAutocomplete] = useState();
  const fileInputRef = useRef(null);
  const imgInputRef = useRef(null);
  const [fileInputLabel, setFileInputLabel] = useState('Upload File');
  const [imgInputLabel, setImgInputLabel] = useState('Upload Image');
  const [resetKey, dispatch] = useReducer(reducer, initialState);
  const [collectionsList, setCollectionsList] = useState([]);
  const [schematicsCollections, setSchematicsCollections] = useState([]);
  const [updatedCollectionsList, setUpdatedCollectionsList] = useState([]);
  const [removedCollections, setRemovedCollection] = useState([]);
  const [newCollections, setNewCollections] = useState([]);



  useEffect(() => {
    function getRemovedCollections() {
      const updatedCollectionIds = new Set(updatedCollectionsList.map((collection) => collection.collection_id));

      const removed = schematicsCollections.filter((collection) => !updatedCollectionIds.has(collection.collection_id));

      setRemovedCollection(removed);
    }
    function getNewCollections() {
      const schematicsCollectionIds = new Set(schematicsCollections.map((collection) => collection.collection_id));
      const addedCollections = updatedCollectionsList.filter((collection) => !schematicsCollectionIds.has(collection.collection_id));
      setNewCollections(addedCollections);
    }

    getRemovedCollections();
    getNewCollections();
  }, [updatedCollectionsList, schematicsCollections]);

  useEffect(() => {
    customFetch(`/get-schematic/${id}`)
      .then((response) => {
        setSchematic(response.data);
        setSchematicName(response.data.name);
        setFileInputLabel(response.data.original_file_name);

        response.data.tags.forEach((tag) => {
          setTags((prev) => [...prev, tag]);
        });
      })
      .catch((error) => console.error('Error fetching schematic:', error));
  }, []);

  useEffect(() => {
    async function fetchCollections() {
      const collectionsList = await customFetch('/get-collections-list', 'GET');
      setCollectionsList(collectionsList.data.collections);

      if (schematic && schematic._id) {
        const schematicsCollectionsList = await customFetch(`/get-schematcis-collection-list/${schematic._id}`, 'GET');
        setSchematicsCollections(schematicsCollectionsList.data.currentCollections);
      }
    }

    fetchCollections();
  }, [schematic]);

  async function fetchTags() {
    const allTags = await customFetch('/get-tags', 'GET')
      .then((response) => setTagAutocomplete(response.data[0].tags));
  }

  useEffect(() => {
    fetchTags();
  }, []);

  async function updateSchematic(event) {
    const fileInput = fileInputRef.current;
    const imgInput = imgInputRef.current;
    event.preventDefault();

    // Check for bad input
    if (tags.length < 1 || schematicName.trim() === '') {
      if (schematicName.trim() === '') {
        return notifyError('Please enter schematic name to continue.');
      }
      if (tags.length < 1) {
        return notifyError('Please enter schematic tags to continue.');
      }
      return notifyError('Check input and try again.');
    }

    // If all good continue
    if (tags.length > 0 && schematicName.trim() !== '') {
      notifyInfo('Schematic is being processed');
      let file;
      let image;
      if (fileInput.files[0]) file = fileInput.files[0];
      if (imgInput.files[0]) image = imgInput.files[0];

      const setFileToBase64 = (imgFile) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(imgFile);
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
      });

      try {
        const formData = new FormData();

        if (file) formData.append('schematicFile', file);
        let compressedImage;

        if (image) {
          compressedImage = await imageCompressor(imgInput.files[0]);
          const imageBase64 = await setFileToBase64(compressedImage);
          formData.append('image', imageBase64);

          const { blurHash, width, height } = await encodeImageToBlurHash(compressedImage);
          formData.append('blurHash', blurHash);
          formData.append('blurHashWidth', width);
          formData.append('blurHashHeight', height);
        }
        formData.append('tags', tags.join(','));
        formData.append('schematicName', schematicName);
        formData.append('updatedCollections', JSON.stringify(newCollections));
        formData.append('removedCollections', JSON.stringify(removedCollections));

        const result = await customFetch(`/update-schematic/${id}`, 'POST', formData)
        // Display responses based on status returned
          .then((response) => {
            if (response.status === 200) {
              setNewCollections([]);
              setRemovedCollection([]);
              return notifySuccess('Schematic updated successfully!');
            }
            if (response.status === 400) {
              return notifyError('This schematic already exists in database, canceling update!');
            }
            if (response.status === 500) {
              return notifyError('Error updating the schematic!');
            }
            return notifyError('Error updating the schematic!');
          });
        fetchTags();
      } catch (err) {
        console.error(err);
      }
    }
  }

  // Image Drag & Drop
  function handleDrop(event) {
    event.preventDefault();
    const { files } = event.dataTransfer;

    // File types for comparison
    const imgTypes = ['png', 'jpg', 'jpeg'];
    const schemTypes = ['schematic', 'schem'];

    // Parse file extension
    const fileName = files[0].name;
    const extension = fileName.split('.');
    const ext = extension.slice(-1)[0];

    function updateInput(elementRef, file) {
      if (file) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        elementRef.current.files = dataTransfer.files;

        // Manually trigger the onChange event
        const changeEvent = new Event('change', { bubbles: true });
        elementRef.current.dispatchEvent(changeEvent);
      }
    }
    // Compare extension with image types
    imgTypes.forEach((type) => {
      if (ext === type) {
        updateInput(imgInputRef, files[0]);
      }
    });

    // Compare extension with schematic types
    schemTypes.forEach((type) => {
      if (ext === type) {
        updateInput(fileInputRef, files[0]);
      }
    });
  }

  // Clipboard paste
  const handlePaste = (event) => {
    // File types for comparison
    const imgTypes = ['png', 'jpg', 'jpeg'];
    const schemTypes = ['schematic', 'schem'];

    // Get Clipboard file
    const { clipboardData } = event;
    const { files } = clipboardData;

    // Parse file extension
    const fileName = files[0].name;
    const extension = fileName.split('.');
    const ext = extension.slice(-1)[0];

    // Compare extension with image types
    imgTypes.forEach((type) => {
      if (ext === type) {
        updateRef(imgInputRef, files[0]);
      }
    });

    // Compare extension with schematic types
    schemTypes.forEach((type) => {
      if (ext === type) {
        updateRef(fileInputRef, files[0]);
      }
    });

    function updateRef(elementRef, file) {
      if (file) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        elementRef.current.files = dataTransfer.files;

        // Manually trigger the onChange event
        const changeEvent = new Event('change', { bubbles: true });
        elementRef.current.dispatchEvent(changeEvent);
      }
    }
  };

  return (
    <div className="edit-schematic-div" onDrop={handleDrop} onDragOver={(event) => event.preventDefault()} onPaste={handlePaste}>
      <div className="upload-schematic-content">
        <form id="upload-form" onSubmit={updateSchematic}>
          <h1>Edit Schematic</h1>
          <FormInput
            label="Schematic name"
            id={uuid()}
            name="name"
            type="text"
            placeholder="Name"
            onChange={(event) => setSchematicName(event.target.value)}
            text={schematicName}
            required
          />
          <FileInput
            reference={fileInputRef}
            reset={resetKey}
            label={fileInputLabel}
          />

          <ImgInputComponent
            reference={imgInputRef}
            label={imgInputLabel}
            schematicObj={schematic}
          />
          <TagsInput
            tags={tags}
            setTags={setTags}
            autocomplete={tagAutocomplete}
            id="tags-input"
          />
          <CollectionsPicker
            collectionsData={collectionsList}
            currentCollectionsData={schematicsCollections}
            schematicData={schematic}
            updateSchematicCollections={setUpdatedCollectionsList}
          />
          <button className="submit-btn" type="submit">Update Schematic</button>
        </form>
      </div>
      {/* <div className="background-overlay" /> */}
    </div>
  );
}

export default EditSchematic;
