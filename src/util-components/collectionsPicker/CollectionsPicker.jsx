/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import DropdownSelector from './dropdown/DropdownSelector';
import customFetch from '../../../fetchMethod';
import DropdownSearchInput from './dropdownSearchInput/DropdownSearchInput';
import './collectionsPicker.scss';

function CollectionsPicker({
  collectionsData, currentCollectionsData, schematicData, updateSchematicCollections,
}) {
  const [collections, setCollections] = useState([]);
  const [currentCollections, setCurrentCollections] = useState([]);
  const [dropdownCollections, setDropdownCollections] = useState([]);
  const [schematic, setSchematic] = useState();

  // Store all the data
  useEffect(() => {
    setCollections(collectionsData);
    setCurrentCollections(currentCollectionsData);
    setSchematic(schematicData);
  }, [collectionsData, currentCollectionsData, schematicData]);

  useEffect(() => {
    console.log('CURRENT COLLECTIONS IS:');
    console.log(currentCollections);
  }, [currentCollections]);


  useEffect(() => {
    // Returns a set of unique ID's
    if (Array.isArray(currentCollections) && Array.isArray(collections)) {
      // Get ids of current collection
      const currentCollectionIds = new Set(currentCollections.map((collection) => collection.collection_id));

      // Gets all other collections > [{collection_id, collection_name}]
      // Goes into Dropdown component for display
      const otherCollections = collections.filter((collection) => !currentCollectionIds.has(collection.collection_id));
      setDropdownCollections(otherCollections);
    }
  }, [currentCollections, collections, collectionsData]);



  // ======================= [Collection display field] =======================
  // Removes collection from the CurrentCollections arr
  function removeCollection(id) {
    const updatedCollections = currentCollections.filter((collection) => collection.collection_id !== id);
    setCurrentCollections(updatedCollections);
  }
  // Adds new collection to CurrentCollections arr
  function addCollection(id) {
    console.log(id);

    const newCollection = collections.find((collection) => collection.collection_id === id);
    setCurrentCollections((prev) => [...prev, newCollection]);
  }
  function displayCollection(name, id) {
    return (
      <button
        type="button"
        key={id}
        name={id}
        className="collection"
        onClick={() => removeCollection(id)}
      >
        <p>{name}</p>
      </button>
    );
  }
  // ======================= [/Collection display field] =======================

  function selectDropdownItem(e) {
    const collectionId = e.target.name;

    // Find the selected collection
    const selectedCollection = dropdownCollections.find((collection) => collection.collection_id === collectionId);

    // Filter out the selected collection from the dropdownCollections
    const newDropdownCollections = dropdownCollections.filter((collection) => collection.collection_id !== collectionId);

    // Update the state
    setDropdownCollections(newDropdownCollections);

    // Add the selected collection to the currentCollections
    setCurrentCollections((prevCollections) => [...prevCollections, selectedCollection]);
  }

  useEffect(() => {
    updateSchematicCollections(currentCollections);
  }, [currentCollections, updateSchematicCollections]);


  return (
    <div>
      <h3>Add / Remove from collections</h3>
      {/* Search Field Section */}
      <div className="search-collections-container">
        <DropdownSearchInput
          autocomplete={dropdownCollections}
          removeCollection={() => removeCollection()}
          addCollection={(id) => addCollection(id)}
        />
      </div>


      {/* Dropdown section */}
      <div className="dropdown-component-container">
        {dropdownCollections && (
        <DropdownSelector
          data={dropdownCollections}
          selectItem={(e) => selectDropdownItem(e)}
        />
        )}
      </div>


      {/* Display collections field */}
      <div className="display-collections">
        {currentCollections && currentCollections.length > 0 && (
          currentCollections.map((collection) => (
            displayCollection(collection.collection_name, collection.collection_id)
          ))
        )}

      </div>
    </div>
  );
}
export default CollectionsPicker;
