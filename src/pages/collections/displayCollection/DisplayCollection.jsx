/* eslint-disable no-nested-ternary */
import {
  useState, React,
} from 'react';
import './displayCollection.scss';
import { v4 as uuid } from 'uuid';
import { Link } from 'react-router-dom';
import { notifySuccess, notifyError } from '../../../util-components/Notifications';
import customFetch from '../../../../fetchMethod';

function DisplayCollection({
  data, popCollection,
}) {
  const [collectionData, setCollectionData] = useState(data);
  const [confirmRemove, setConfirmRemove] = useState(false);
  function showConfirm() {
    setConfirmRemove(true);
  }
  function closeConfirm() {
    setConfirmRemove(false);
  }
  async function removeCollection(e) {
    popCollection(e);
    const id = data._id;
    const response = await customFetch(`/remove-collection/${id}`, 'POST');
    if (response.status === 200) {
      return notifySuccess('Collection removed successfully!');
    }
    return notifyError(response.data.message);
  }

  return (
    <div className="collection-container">
      <Link
        to={`/collections/${data._id}`}
        className="link"
      >
        <article>
          {collectionData && (
          <div>
            <h2 className="title">{collectionData.name}</h2>
            <div className="collection-img-container">
              <img className="image-collection" src={collectionData.image.url} alt={`${collectionData.name} collection`} />
            </div>

          </div>
          )}
        </article>
      </Link>
      {confirmRemove && (
      <div className="confirmation-modal">
        <div className="choices-container">
          <h3 className="text">Are you sure you want to remove this collection?</h3>
          <div className="buttons-container">
            {/* BUTTON YES */}
            {collectionData && collectionData._id && (
              <button
                type="button"
                className="btn-yes"
                onClick={(e) => removeCollection(e)}
                name={collectionData._id}
              >
                Yes
              </button>
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

      <button
        type="button"
        onClick={showConfirm}
        className="remove-collection-button"
      >
        Remove
      </button>
    </div>
  );
}

export default DisplayCollection;
