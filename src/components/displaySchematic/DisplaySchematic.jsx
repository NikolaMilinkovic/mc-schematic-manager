/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import {
  React, useState, useEffect, useContext,
} from 'react';
import './displaySchematic.scss';
import { ToastContainer, Bounce } from 'react-toastify';
import { Link } from 'react-router-dom';
import { notifySuccess, notifyError, notifyInfo } from '../../util-components/Notifications';
import customFetch from '../../../fetchMethod';
import { UserContext } from '../../../UserContext';

function DisplaySchematic({ schematic, index, popSchematic }) {
  const [getButtonState, setGetButtonState] = useState(false);
  const { activeUser, handleSetActiveUser } = useContext(UserContext);

  useEffect(() => {
    console.log('LOGGING SCHEMATIC IN DISPLAY SCHEMATIC COMPONENT');
    console.log(schematic);
  }, []);

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
        return notifyError('Uh on something went wrong!');
      });
  }

  return (
    <article key={index} className="schematic-container">

      <h2 className="schematic-title">{schematic.name}</h2>
      <div className="display-schematic-img-container">
        <img src={schematic.image.url} alt={schematic.name} />
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

          {activeUser && activeUser.permissions.schematic.remove_schematic === true && <button type="button" onClick={removeSchematic} className="remove-button" name={schematic._id}>Remove</button>}
        </div>
      </div>
    </article>
  );
}

export default DisplaySchematic;
