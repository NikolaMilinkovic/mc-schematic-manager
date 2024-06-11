import {
  useState, React, useEffect, useContext,
} from 'react';
import './collections.scss';
import DraggableButton from '../../components/DraggableButton/DraggableButton';
import AddCollection from './addCollections/AddCollection';
import { UserContext } from '../../../UserContext';
import customFetch from '../../../fetchMethod';
import DisplayCollection from './displayCollection/DisplayCollection';
import { notifySuccess, notifyError, notifyInfo } from '../../util-components/Notifications';

function Collections({ schematicsFilter }) {
  const [addCollectionState, setAddCollectionState] = useState(false);
  const { activeUser, handleSetActiveUser } = useContext(UserContext);
  const [collections, setCollections] = useState([]);

  async function fetchCollectionsData() {
    try {
      const collectionsData = await customFetch('/get-collections', 'GET');
      setCollections(collectionsData.data.collections);
      if (collectionsData.status !== 200) {
        notifyError('There was an error fetching Collections Data.');
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCollectionsData();
  }, []);

  function showAddCollection() {
    setAddCollectionState((prevState) => !prevState);
  }

  return (
    <main className="collections-main">
      {collections && (
        collections.map((collection) => (
          <DisplayCollection
            key={collection._id}
            data={collection}
          />
        ))
      )}
      <DraggableButton
        pathString="/collections"
        onClick={() => showAddCollection()}
      />
      <AddCollection
        state={addCollectionState}
        toggleState={() => showAddCollection()}
      />
      <div className="background-overlay-dashboard" />
    </main>
  );
}

export default Collections;
