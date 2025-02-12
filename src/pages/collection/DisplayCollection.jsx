import {
  useState, React, useEffect, useRef,
} from 'react';
import './displayCollection.scss';
import { v4 as uuid } from 'uuid';
import { Link, useParams } from 'react-router-dom';
import FormInput from '../../util-components/FormInput';
import { notifySuccess, notifyError, notifyInfo } from '../../util-components/Notifications';
import ImgInputComponent from '../../util-components/imgInputComponent/ImgInputComponent';
import TagsInput from '../../util-components/TagsInput';
import imageCompressor from '../../../util-methods/imageCompressor';
import customFetch from '../../../fetchMethod';
import DisplaySchematic from '../../components/displaySchematic/DisplaySchematic';
import DraggableButton from '../../components/DraggableButton/DraggableButton';
import Loading from '../../components/loading/Loading';
import CollectionLanding from './collectionLanding/CollectionLanding';
import UploadSchematicToCollectionPopup from './UploadSchematicToCollectionPopup/UploadSchematicToCollectionPopup';

function DisplayCollection({ collectionsFilter, key }) {
  const { id } = useParams(); // Get the id from the URL
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addSchematicState, setAddSchematicState] = useState(false);
  const [renderer, setRenderer] = useState(0);
  function rerender() {
    setRenderer((prev) => prev + 1);
  }


  useEffect(() => {
    async function fetchCollection() {
      try {
        const response = await customFetch(`/get-collection/${id}`, 'GET');
        if (response.status === 200) {
          if (response.data.collection) {
            setCollection(response.data.collection);
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
  }, [id]);

  function showAddSchematic() {
    setAddSchematicState((prevState) => !prevState);
  }

  return (
    <main className="display-collection-main" onScroll={(e) => handleScroll(e)}>
      <div className="dashboard-container">
        <div className="background-overlay-collection" />
        <CollectionLanding
          collectionsFilter={collectionsFilter}
          data={collection}
          scroll={(e) => handleScroll(e)}
          rerender={renderer}
        />
      </div>

      <DraggableButton
        onClick={() => showAddSchematic()}
      />
      <UploadSchematicToCollectionPopup
        state={addSchematicState}
        toggleState={showAddSchematic}
        collectionData={collection}
        rerender={() => rerender()}
      />
      {/* <AddSchematicToCollection
        state={addSchematicState}
        toggleState={() => showAddSchematic()}
      /> */}
    </main>
  );
}

export default DisplayCollection;
