/* eslint-disable no-nested-ternary */
import {
  useState, React,
} from 'react';
import './collections.scss';
import DraggableButton from '../../components/DraggableButton/DraggableButton';
import AddCollection from './addCollections/AddCollection';
import CollectionsLanding from './collectionsLanding/CollectionsLanding';

function Collections({ collectionsFilter }) {
  const [addCollectionState, setAddCollectionState] = useState(false);
  const [renderer, setRenderer] = useState(0);

  function showAddCollection() {
    setAddCollectionState((prevState) => !prevState);
  }
  function rerender() {
    setRenderer((prev) => prev + 1);
  }

  return (
    <body className="dashboard-body">
      <div className="dashboard-container">
        <CollectionsLanding
          collectionsFilter={collectionsFilter}
          renderer={renderer}
        />
      </div>

      <DraggableButton
        onClick={() => showAddCollection()}
      />
      <AddCollection
        state={addCollectionState}
        toggleState={() => showAddCollection()}
        renderer={() => rerender()}
      />
      <div className="background-overlay-dashboard" />
    </body>
  );
}

export default Collections;
