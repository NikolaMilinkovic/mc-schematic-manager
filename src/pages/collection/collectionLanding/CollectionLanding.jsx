/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import { v4 as uuid } from 'uuid';
import React, { useState, useEffect, useRef } from 'react';
import './collectionLanding.scss';
import { useParams } from 'react-router-dom';
import Loading from '../../../components/loading/Loading';
import { notifyError, notifyInfo, notifySuccess } from '../../../util-components/Notifications';
import customFetch from '../../../../fetchMethod';
import DisplaySchematic from '../../../components/displaySchematic/DisplaySchematic';
import FormInput from '../../../util-components/FormInput';
import TagsInput from '../../../util-components/TagsInput';
import imageCompressor from '../../../../util-methods/imageCompressor';
import setFileToBase64 from '../../../../util-methods/fileToBase64';
import encodeImageToBlurHash from '../../../../util-methods/encodeToBlurHash';



function CollectionLanding({ schematicsFilter, data, rerender }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState(null);
  const [schematics, setSchematics] = useState([]);
  const [cachedSchematics, setCachedSchematics] = useState([]);
  const [collectionInfoState, setCollectionInfoState] = useState('closed');
  const [imageDisplay, setImageDisplay] = useState('');
  const [collectionInfoArrow, setCollectionInfoArrow] = useState('rotateX(0deg)');
  const imageInputRef = useRef('');
  const [tagAutocomplete, setTagAutocomplete] = useState('');



  // ==========================[FORM DATA INPUTS]==========================
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
  });
  function onChange(event) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  // ==========================[FORM DATA INPUTS]==========================



  function toggleCollectionInfo() {
    setCollectionInfoState((prevState) => (prevState === 'closed' ? 'open' : 'closed'));
    setCollectionInfoArrow((prevState) => (prevState === 'rotateX(0deg)' ? 'rotateX(180deg)' : 'rotateX(0deg)'));
  }

  // =======================[DATA FETCHING]=======================


  useEffect(() => {
    async function fetchCollection() {
      try {
        const response = await customFetch(`/get-collection/${id}`, 'GET');
        if (response.status === 200) {
          if (response.data.collection) {
            setCollection(response.data.collection);
            setSchematics(response.data.collection.schematics);
            setCachedSchematics(response.data.collection.schematics);
            setImageDisplay(response.data.collection.image.url);
            setTags(response.data.collection.tags);
            setTagAutocomplete(response.data.collection.tags);
          }
        } else {
          notifyError(response.message);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCollection();
  }, [id, rerender]);

  // Set collection name field text
  useEffect(() => {
    if (collection && collection.name) {
      setFormData((prevState) => ({ ...prevState, name: collection.name }));
    }
  }, [collection]);
  // =======================[DATA FETCHING]=======================


  // ==========================[SCHEMATIC FILTERING]==========================
  // Filter Collections based on collectionsFilter
  useEffect(() => {
    if (schematicsFilter) {
      const filteredCollections = cachedSchematics.filter((schematic) => {
        const matchesName = schematic.name.toLowerCase().includes(schematicsFilter.toLowerCase());
        const matchesTags = schematic.tags.some((tag) => tag.toLowerCase().includes(schematicsFilter.toLowerCase()));
        return matchesName || matchesTags;
      });
      setSchematics(filteredCollections);
    } else {
      setSchematics(cachedSchematics);
    }
  }, [schematicsFilter, cachedSchematics]);

  // Removes the schematic from display
  function popSchematic(event) {
    const schematicId = event.target.name;
    const newCollectionList = schematics.filter((schematic) => schematic._id !== schematicId);
    setSchematics(newCollectionList);
  }
  // ==========================[SCHEMATIC FILTERING]==========================



  // ==========================[IMAGE INPUT RELATED]==========================
  function newImageInput() {
    imageInputRef.current.click();
  }
  function handleUpload(event) {
    const file = event.target.files[0];
    if (file && file.name) {
      setImageDisplay(URL.createObjectURL(file));
    }
  }
  function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      imageInputRef.current.files = dataTransfer.files;

      // Manually trigger the onChange event
      const changeEvent = new Event('change', { bubbles: true });
      imageInputRef.current.dispatchEvent(changeEvent);
    }
  }
  // ==========================[IMAGE INPUT RELATED]==========================



  // ==========================[SAVE CHANGES METHOD]==========================
  async function updateCollection(e) {
    e.preventDefault();
    const imageInput = imageInputRef.current;

    // Input validation
    if (formData.name.trim() === '') {
      setFormData((prev) => ({ ...prev, name: collection.name }));
      return notifyError('Collection must have a name, please try again.');
    }
    if (tags.length === 0) {
      return notifyError('Collection must have at least one tag, please try again.');
    }

    notifyInfo('Updating profile...');
    try {
      let avatar;
      const newFormData = new FormData();

      if (imageInput.files[0]) {
        avatar = await imageCompressor(imageInput.files[0]);
        const imageBase64 = await setFileToBase64(avatar);
        newFormData.append('avatar', imageBase64);

        const { blurHash, width, height } = await encodeImageToBlurHash(avatar);
        newFormData.append('blurHash', blurHash);
        newFormData.append('blurHashWidth', width);
        newFormData.append('blurHashHeight', height);
      }
      newFormData.append('name', formData.name);
      newFormData.append('tags', tags);

      const response = await customFetch(`/update-collection/${collection._id}`, 'POST', newFormData);

      // Response handling
      if (response.status === 201 || response.status === 200 || response.status === 304) {
        notifySuccess('Profile updated successfully!');
      } else if (response.data.message) {
        notifyError(response.data.message);
      } else {
        notifyError('There was an error updating the collection.');
      }
    } catch (err) {
      console.error(err);
      notifyError('Error: ', err);
    }
  }
  // ==========================[SAVE CHANGES METHOD]==========================

  return (
    <div className="landing-content">
      {/* && schematics[0] */}
      {collection ? (
        <div className="landing-content-wrapper">
          {/* Collection Info Component */}
          <div
            className={`collection-info ${collectionInfoState === 'open' ? 'info-open-state' : 'info-closed-state'}`}
          >
            {/* Collection info button */}
            <div className="title">
              <button
                type="button"
                className="toggle-preview-btn"
                onClick={toggleCollectionInfo}
              >
                <h1>{collection ? collection.name : ''}</h1>
                <img
                  className="toggle-preview-icon"
                  style={{ transform: `${collectionInfoArrow}` }}
                  src="/icons/angle-down-solid.svg"
                  alt="Toggle preview"
                />
              </button>
            </div>
            {/* Collection Info content */}
            <div
              onDrop={(e) => handleDrop(e)}
              onDragOver={(event) => event.preventDefault()}
              className={`collection-info-content ${collectionInfoState === 'open' ? 'info-content-open-state' : 'info-content-closed-state'}`}
            >
              <div
                className="collection-img-container"
              >
                <p>Update image:</p>
                <img
                  className="collection-avatar"
                  src={imageDisplay}
                  loading="lazy"
                  alt={collection ? collection.name : ''}
                  onClick={(e) => newImageInput(e)}
                />
                <input
                  type="file"
                  accept="image/*"
                  name="avatar"
                  id="avatar-input"
                  ref={imageInputRef}
                  onChange={handleUpload}
                />
                <button
                  type="button"
                  className="collection-upload-avatar-button"
                  onClick={(e) => newImageInput(e)}
                >
                  Upload new image
                </button>
              </div>
            </div>

            {/* INPUTS N SHIT */}
            <div
              className={`information-inputs ${collectionInfoState === 'open' ? 'info-content-open-state' : 'info-content-closed-state'}`}
            >
              <div className="collection-input-name-container">
                <FormInput
                  label="Collection Name"
                  id={uuid()}
                  name="name"
                  type="text"
                  placeholder="Collection Name"
                  onChange={(e) => onChange(e)}
                  text={formData.name ? formData.name : ''}
                  required
                  borderBottom="2px solid var(--borders)"
                  labelColor={{ color: 'var(--white)' }}
                />
              </div>
              {/* PLACEHOLDER FOR GRID LAYOUT */}
              <div className="placeholder" />

              <TagsInput
                tags={tags}
                setTags={setTags}
                autocomplete={tagAutocomplete}
                id="tags-input"
                className="tags-input"
              />
            </div>
            {/* END OF INPUTS SECTION */}
            <div
              className={`add-remove-schem-container ${collectionInfoState === 'open' ? 'info-content-open-state' : 'info-content-closed-state'}`}
            >
              <h2>Add / Remove schematic to collection:</h2>
              {/* ADD / REMOVE SHCMEATIC COMPONENT */}

              {/* SUBMIT BUTTON */}
              <div className="submit-button-container">
                <button
                  type="button"
                  className="save-changes-button"
                  onClick={updateCollection}
                >
                  Save changes
                </button>
              </div>
            </div>


          </div>
          {/* Schematics container */}
          <div className="schematics-container">
            {schematics && schematics.length > 0 && schematics[0] !== undefined
              ? (
                schematics.map((schematic) => (
                  <DisplaySchematic
                    schematic={schematic}
                    popSchematic={popSchematic}
                    key={schematic._id}
                    collectionId={collection._id}
                  />
                ))
              ) : (
                <Loading zIndex="2" text="Pedro stole all schematics..." background={false} />
              )}
          </div>
        </div>
      ) : (
        <Loading zIndex="1" text="Loading..." />
      )}

    </div>
  );
}

export default CollectionLanding;
