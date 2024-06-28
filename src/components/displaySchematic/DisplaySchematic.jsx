/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import {
  React, useState, useEffect, useContext,
} from 'react';
import './displaySchematic.scss';
import { ToastContainer, Bounce } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Blurhash } from 'react-blurhash';
import { notifySuccess, notifyError, notifyInfo } from '../../util-components/Notifications';
import customFetch from '../../../fetchMethod';
import { UserContext } from '../../../UserContext';

function DisplaySchematic({
  schematic, index, popSchematic, collectionId,
}) {
  const [getButtonState, setGetButtonState] = useState(false);
  const { activeUser, handleSetActiveUser } = useContext(UserContext);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [removeOrDelete, setRemoveOrDelete] = useState();

  function showConfirm(para) {
    if (para === 'delete') {
      setRemoveOrDelete('delete');
    }
    if (para === 'remove') {
      setRemoveOrDelete('remove');
    }
    setConfirmRemove(true);
  }
  function closeConfirm() {
    setConfirmRemove(false);
  }

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  async function downloadSchematic(event) {
    const id = event.target.name;
    const response = await customFetch(`/get-schematic-file/${id}`);
    if (response.data.ok) {
      notifySuccess('Success, downloading schematic now!');
      const blob = await response.data.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = schematic.original_file_name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } else {
      notifyError('Failed to download schematic.');
    }
  }

  async function getSchematicString(event) {
    try {
      const id = event.target.name;
      const response = await customFetch(`/get-schematic-fawe-string/${id}`);
      const displayUrl = await response.data.text();

      if (displayUrl) {
        await navigator.clipboard.writeText(displayUrl)
          .then(async () => {
            notifySuccess('Success, schematic copied!');
            setGetButtonState(true);
            setTimeout(() => {
              setGetButtonState(false);
            }, 500);
          });
      } else {
        notifyError('Error getting the schematic string! CALL HELVOS!');
      }
    } catch (err) {
      notifyError('Uh oh, something went wrong! CALL HELVOS!');
      console.error(err);
    }
  }

  // Removes schematic from DB and Display
  async function removeSchematic(event) {
    const id = event.target.name;
    popSchematic(event);
    const removeStatus = await customFetch(`/remove-schematic/${id}`)
      .then((response) => {
        if (response.status === 201) {
          return notifySuccess('Success, schematic removed!');
        }
        return notifyError('Uh oh something went wrong!');
      });
  }

  // Removes schematic from Collection and Display
  async function removeSchematicFromCollection(event) {
    const id = event.target.name;
    const formData = new FormData();
    formData.append('collectionId', collectionId);

    try {
      const response = await customFetch(`/remove-schematic-from-collection/${id}`, 'POST', formData);

      if (response.status === 201 || response.status === 200) {
        notifySuccess('Success, schematic removed from collection!');
        popSchematic(event);
      } else {
        notifyError(response.data.message);
      }
    } catch (err) {
      console.error('Error removing schematic:', err);
      notifyError('An error occurred while removing the schematic.');
    }
  }
  return (
    <article key={index} className="schematic-container">
      <h2 className="schematic-title">{schematic.name}</h2>
      {confirmRemove && (
      <div className="confirmation-modal">
        <div className="choices-container">
          {/* DELETE or REMOVE */}
          {removeOrDelete === 'delete' ? (
            <h3 className="text">Are you sure you want to DELETE this schematic?</h3>
          ) : (
            <h3 className="text">Are you sure you want to REMOVE this schematic from this collection?</h3>
          )}
          <div className="buttons-container">
            {/* BUTTON YES */}
            {/* DELETE or REMOVE */}
            {removeOrDelete === 'delete' ? (
              (
                // BUTTON DELETE
                <button
                  type="button"
                  className="btn-yes"
                  onClick={(e) => removeSchematic(e)}
                  name={schematic._id}
                >
                  Yes
                </button>
              )
            ) : (
              (
                // BUTTON REMOVE FROM COLLECTION
                <button
                  type="button"
                  className="btn-yes"
                  onClick={(e) => removeSchematicFromCollection(e)}
                  name={schematic._id}
                >
                  Yes
                </button>
              )
            )}


            {/* BUTTON NO */}
            <button
              type="button"
              className="btn-no"
              onClick={closeConfirm}
            >
              No
            </button>
          </div>
        </div>
      </div>
      )}


      <div
        className="display-schematic-img-container"
      >
        {schematic && schematic.blur_hash && !imageLoaded ? (
          <Blurhash
            hash={schematic.blur_hash.hash}
            width={schematic.blur_hash.width}
            height={schematic.blur_hash.height}
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
        ) : null}
        <img
          src={schematic.image.url}
          alt={schematic.name}
          loading="lazy"
          style={{ display: imageLoaded ? 'block' : 'hidden' }}
          onLoad={handleImageLoad}
          className={imageLoaded ? '' : 'hide'}
        />
      </div>
      <div className="schematic-display-buttons">
        {activeUser && activeUser.permissions.schematic.get_schematic ? (
          !getButtonState ? (
            <button type="button" className="get-button" name={schematic._id} onClick={(e) => getSchematicString(e)}>Get Schematic</button>
          ) : (
            <button type="button" className="get-button btn-copied" name={schematic._id} onClick={(e) => getSchematicString(e)}>Copied to clipboard!</button>
          )
        ) : null}

        <div>
          {activeUser && activeUser.permissions.schematic.edit_schematic && (
          <button type="button">
            <Link
              className="link"
              name="link"
              to={`/edit-schematic/${schematic._id}`}
            >
              Edit
            </Link>
          </button>
          )}
          {activeUser && activeUser.permissions.schematic.download_schematic && (
          <button type="button" onClick={downloadSchematic} name={schematic._id}>Download</button>
          )}

          {activeUser && activeUser.permissions.schematic.remove_schematic === true && <button type="button" onClick={() => showConfirm('delete')} className="remove-button">Delete</button>}

        </div>
        {collectionId && (
        <div>
          {activeUser && activeUser.permissions.schematic.remove_schematic === true && <button type="button" onClick={() => showConfirm('remove')} className="remove-button">Remove from collection</button>}
        </div>
        )}
      </div>
    </article>
  );
}

export default DisplaySchematic;
