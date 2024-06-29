import React, { useState, useEffect, useRef } from 'react';
import './dropdownSearchInput.scss';

function DropdownSearchInput({ autocomplete, removeCollection, addCollection }) {
  const [input, setInput] = useState('');
  // const collectionInput = useRef(null);
  const collectionInput = document.getElementById('collection-input');
  const [spanValue, setSpanValue] = useState('');
  const [addedCollection, setAddedCollection] = useState('');
  const [matchingKeyword, setMatchingKeyword] = useState('');

  useEffect(() => {
    function findMatch(value, inputEl) {
      const regex = new RegExp(`^${value}`, 'i');

      // Run the input value through the regex
      setMatchingKeyword(autocomplete.find((keyword) => regex.test(keyword.collection_name) && inputEl.value !== ''));

      if (matchingKeyword) {
        console.log(matchingKeyword);
        // Change case of keyword in keywords array according to user input
        const suggestion = caseCheck(matchingKeyword);
        console.log(suggestion);
        // Display suggestion
        setSpanValue(suggestion);
      } else {
        // Clear suggestion if keyword is not found
        setSpanValue('');
      }
    }
    function caseCheck(value) {
      // Array of characters
      const word = value.collection_name.split('');

      // Loop through every character in inp
      for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (char !== word[i]) {
          return value.collection_name;
        } if (char.toUpperCase() === word[i]) {
          word[i] = word[i].toUpperCase();
        } else {
          word[i] = word[i].toLowerCase();
        }
      }

      return word.join('');
    }
    function handleAutocomplete() {
      findMatch(input, collectionInput);
    }
    handleAutocomplete();
    if (input === '') {
      setSpanValue('');
    }
  }, [input, collectionInput, autocomplete, matchingKeyword]);

  function handleInputChange(event) {
    setInput(event.target.value);
  }

  function buttonAddCollection() {
    addCollection(matchingKeyword.collection_id);
    setInput('');
    setSpanValue('');
    collectionInput.focus();
  }
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addCollection(matchingKeyword.collection_id);
      setInput('');
      setSpanValue('');
      collectionInput.focus();
    }
    if (event.key === 'Tab' && input) {
      event.preventDefault();
      if (spanValue) {
        setInput(spanValue);
        setAddedCollection();
      }
      setSpanValue('');
    }
  }

  return (
    <div className="input-container">
      <div className="input-wrapper">
        <input
          type="text"
        // onChange={(e) => setInput(e.target.value)}
          name="collection-input"
          id="collection-input"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Insert collection name here"
        />
        <span id="autocomplete-span">{spanValue}</span>
      </div>
      <button type="button" onClick={buttonAddCollection}>Add Tag</button>
    </div>

  );
}

export default DropdownSearchInput;
