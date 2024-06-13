/* eslint-disable no-nested-ternary */
import {
  useState, React, useEffect, useRef,
} from 'react';
import './displayCollection.scss';
import { v4 as uuid } from 'uuid';
import { Link } from 'react-router-dom';
import FormInput from '../../../util-components/FormInput';
import { notifySuccess, notifyError, notifyInfo } from '../../../util-components/Notifications';
import ImgInputComponent from '../../../util-components/imgInputComponent/ImgInputComponent';
import TagsInput from '../../../util-components/TagsInput';
import imageCompressor from '../../../../util-methods/imageCompressor';
import customFetch from '../../../../fetchMethod';
import DisplaySchematic from '../../../components/displaySchematic/DisplaySchematic';
import DraggableButton from '../../../components/DraggableButton/DraggableButton';

function DisplayCollection({
  data, state, toggleState,
}) {
  const [collectionData, setCollectionData] = useState(data);
  const [isFlipped, setIsFlipped] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  function turnCard(e) {
    e.preventDefault();
    setIsFlipped(!isFlipped);
    setFirstClick(false);
  }

  return (
    <div className="collection-container">
      <Link
        to={`/collections/${data._id}`}
        onContextMenu={(e) => turnCard(e)}
        className="link"
      >
        <article>
          {collectionData && (
          <div>
            <h2 className="title">{collectionData.name}</h2>
            <div className="img-container">
              <img className="image" src={collectionData.image.url} alt={`${collectionData.name} collection`} />
            </div>
          </div>
          )}
        </article>
      </Link>
    </div>
  );
}

export default DisplayCollection;
