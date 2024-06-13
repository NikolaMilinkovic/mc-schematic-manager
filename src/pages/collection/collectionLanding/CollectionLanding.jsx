/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef } from 'react';
import './collectionLanding.scss';
import { useParams } from 'react-router-dom';
import Loading from '../../../components/loading/Loading';
import { notifyError } from '../../../util-components/Notifications';
import customFetch from '../../../../fetchMethod';
import DisplayCollection from '../DisplayCollection';
import DisplaySchematic from '../../../components/displaySchematic/DisplaySchematic';

function CollectionLanding({ schematicsFilter, data }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState(null);
  const [schematics, setSchematics] = useState([]);
  const [cachedScehmatics, setCachedScehmatics] = useState([]);
  const [collectionInfoState, setCollectionInfoState] = useState('open');
  const [collectionInfoArrow, setCollectionInfoArrow] = useState('rotateX(0deg)');
  const imageInputRef = useRef('');

  function toggleCollectionInfo() {
    setCollectionInfoState((prevState) => (prevState === 'closed' ? 'open' : 'closed'));
    setCollectionInfoArrow((prevState) => (prevState === 'rotateX(0deg)' ? 'rotateX(180deg)' : 'rotateX(0deg)'));
  }

  async function fetchCollection() {
    try {
      const response = await customFetch(`/get-collection/${id}`, 'GET');
      if (response.status === 200) {
        if (response.data.collection) {
          setCollection(response.data.collection);
          setSchematics(response.data.collection.schematics);
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
  useEffect(() => {
    fetchCollection();
  }, []);

  // Filter Collections based on collectionsFilter
  useEffect(() => {
    if (schematicsFilter) {
      const filteredCollections = cachedScehmatics.filter((schematic) => {
        const matchesName = schematic.name.toLowerCase().includes(schematicsFilter.toLowerCase());
        const matchesTags = schematic.tags.some((tag) => tag.toLowerCase().includes(schematicsFilter.toLowerCase()));
        return matchesName || matchesTags;
      });
      setSchematics(filteredCollections);
    } else {
      setSchematics(cachedScehmatics);
    }
  }, [schematicsFilter, cachedScehmatics]);

  // Removes the schematic from display
  function popSchematic(event) {
    const schematicId = event.target.name;
    const newCollectionList = schematics.filter((schematic) => schematic._id !== schematicId);
    setSchematics(newCollectionList);
  }
  function newImageInput() {
    imageInputRef.current.click();
  }

  return (
    <div className="landing-content">
      {/* && schematics[0] */}
      {schematics ? (
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
              className={`collection-info-content ${collectionInfoState === 'open' ? 'info-content-open-state' : 'info-content-closed-state'}`}
            >
              <div className="collection-img-container">
                <p>Update image:</p>
                <img
                  className="collection-avatar"
                  src={collection ? collection.image.url : ''}
                  alt={collection ? collection.name : ''}
                  onClick={(e) => newImageInput(e)}
                />
                <input
                  type="file"
                  accept="image/*"
                  name="avatar"
                  id="avatar-input"
                  ref={imageInputRef}
                />
              </div>
            </div>

            {/* INPUTS N SHIT */}
            <div
              className={`information-inputs ${collectionInfoState === 'open' ? 'info-content-open-state' : 'info-content-closed-state'}`}
            >
              <p>{collection && (collection.schematics.length)}</p>
            </div>
            {/* END OF INPUTS SECTION */}

          </div>
          {/* Schematics container */}
          <div className="collections-container">
            {schematics && schematics.length !== 0
              ? (
                schematics.map((schematic) => (
                  <DisplaySchematic
                    data={schematic}
                  />
                ))
              ) : (
            // <p>Nothing to see here</p>
                null
                // <Loading zIndex="2" text="Pedro stole all collections..." />
              )}
          </div>
        </div>
      ) : (
        <Loading zIndex="1" text={`${collection.name} has no schematics. Add some!`} />
      )}

    </div>
  );
}

export default CollectionLanding;
