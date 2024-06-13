/* eslint-disable no-nested-ternary */
import {
  useState, React, useContext,
} from 'react';
import './collections.scss';
import DraggableButton from '../../components/DraggableButton/DraggableButton';
import AddCollection from './addCollections/AddCollection';
import { UserContext } from '../../../UserContext';
import CollectionsLanding from './collectionsLanding/CollectionsLanding';

function Collections({ collectionsFilter }) {
  const [addCollectionState, setAddCollectionState] = useState(false);
  const { activeUser, handleSetActiveUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  function showAddCollection() {
    setAddCollectionState((prevState) => !prevState);
  }

  return (
    <body className="dashboard-body">
      <div className="dashboard-container">
        <CollectionsLanding
          collectionsFilter={collectionsFilter}
        />
      </div>

      <DraggableButton
        pathString="/collections"
        onClick={() => showAddCollection()}
      />
      <AddCollection
        state={addCollectionState}
        toggleState={() => showAddCollection()}
      />
      <div className="background-overlay-dashboard" />
    </body>
  );
}

export default Collections;
