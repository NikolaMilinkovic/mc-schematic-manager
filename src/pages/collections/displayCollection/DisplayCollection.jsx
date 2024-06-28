/* eslint-disable no-nested-ternary */
import {
  useState, React,
} from 'react';
import './displayCollection.scss';
import { v4 as uuid } from 'uuid';
import { Link } from 'react-router-dom';
import { Blurhash } from 'react-blurhash';
import { notifySuccess, notifyError } from '../../../util-components/Notifications';
import customFetch from '../../../../fetchMethod';

function DisplayCollection({
  data, popCollection,
}) {
  const [collectionData, setCollectionData] = useState(data);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
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
              {collectionData && collectionData.blur_hash && !imageLoaded ? (
                <Blurhash
                  hash={collectionData.blur_hash.hash}
                  width={200}
                  height={200}
                  resolutionX={32}
                  resolutionY={32}
                  punch={1}
                  className="image-collection"
                />
              ) : null}
              <img
                src={collectionData.image.url}
                alt={`${collectionData.name} collection`}
                loading="lazy"
                style={{ display: imageLoaded ? 'block' : 'hidden' }}
                onLoad={handleImageLoad}
                className={imageLoaded ? 'image-collection' : 'hide'}
              />
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
