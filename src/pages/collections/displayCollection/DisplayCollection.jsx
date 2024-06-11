import {
  useState, React, useEffect, useRef,
} from 'react';
import './displayCollection.scss';
import { v4 as uuid } from 'uuid';
import FormInput from '../../../util-components/FormInput';
import { notifySuccess, notifyError, notifyInfo } from '../../../util-components/Notifications';
import ImgInputComponent from '../../../util-components/imgInputComponent/ImgInputComponent';
import TagsInput from '../../../util-components/TagsInput';
import imageCompressor from '../../../../util-methods/imageCompressor';
import customFetch from '../../../../fetchMethod';

function DisplayCollection({ data, state, toggleState }) {
  const [collectionData, setCollectionData] = useState(data);
  console.log(collectionData);
  return (
    <>
      <article className="collection-card">
        <div className="collection-image-container">
          <img className="image" src={collectionData.image.url} alt={`${collectionData.name} collection`} />
        </div>
        <div className="header-container">
          <h2>{collectionData.name}</h2>
        </div>
        <div className="collection-image-container" />
      </article>
      <section>
        <p />
      </section>
    </>
  );
}

export default DisplayCollection;
