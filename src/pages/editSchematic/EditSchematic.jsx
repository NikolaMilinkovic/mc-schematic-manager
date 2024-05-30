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

  useEffect(() => {
    console.log(id);
    fetch(`http://localhost:3000/get-schematic/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setSchematic(data);
        setSchematicName(data.name);
        setFileInputLabel(data.original_file_name);

        data.tags.forEach((tag) => {
          setTags((prev) => [...prev, tag]);
        });
      })
      .catch((error) => console.error('Error fetching schematic:', error));
  }, []);

  async function fetchTags() {
    const allTags = await fetch('http://localhost:3000/get-tags')
      .then((response) => response.json())
      .then((data) => setTagAutocomplete(data[0].tags));
  }

  useEffect(() => {
    fetchTags();
  }, [schematic]);

  async function updateSchematic(event) {
    const fileInput = fileInputRef.current;
    const imgInput = imgInputRef.current;
    event.preventDefault();

    // Check for bad input
    if (tags.length < 1 || schematicName.trim() === '') {
      if (schematicName.trim() === '') {
        return notifyError('Please enter schematic name to continue.');
      }
      // if (!fileInput.files[0]) {
      //   return notifyError('Please enter a schematic file to continue.');
      // }
      // if (!imgInput.files[0]) {
      //   return notifyError('Please an schematic image to continue.');
      // }
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
        if (image) {
          const imageBase64 = await setFileToBase64(image);
          formData.append('image', imageBase64);
        }
        formData.append('tags', tags.join(','));
        formData.append('schematicName', schematicName);

        console.log(tags);
        console.log(schematicName);

        const result = await fetch(`http://localhost:3000/update-schematic/${id}`, {
          method: 'POST',
          body: formData,
        })
        // Display responses based on status returned
          .then((response) => {
            if (response.status === 200) {
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
      } catch (err) {
        console.log(err);
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

    console.log(ext);

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
    <body className="edit-schematic-body" onDrop={handleDrop} onDragOver={(event) => event.preventDefault()} onPaste={handlePaste}>
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
          <button className="submit-btn" type="submit">Update Schematic</button>
        </form>
      </div>
    </body>
  );
}

export default EditSchematic;
