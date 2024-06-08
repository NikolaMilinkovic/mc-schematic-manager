/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import './tagsInput.scss';

function FormInput({
  tags, setTags, autocomplete,
}) {
  const [input, setInput] = useState('');
  const tagInput = document.getElementById('tag-input');
  const [spanValue, setSpanValue] = useState('');

  function findMatch(value, inputEl) {
    const regex = new RegExp(`^${value}`, 'i');

    // Run the input value through the regex
    const matchingKeyword = autocomplete.find((keyword) => regex.test(keyword) && inputEl.value !== '');

    if (matchingKeyword) {
      // Change case of keyword in keywords array according to user input
      const suggestion = caseCheck(matchingKeyword);
      // Display suggestion
      setSpanValue(suggestion);
    } else {
      // Clear suggestion if keyword is not found
      setSpanValue('');
    }
  }

  function handleAutocomplete() {
    findMatch(input, tagInput);
  }

  function caseCheck(value) {
    // Array of characters
    const word = value.split('');
    const inp = input.value;

    // loop through every character in inp
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const i in inp) {
      const char = inp[i];
      if (char !== word[i]) {
        return;
      } if (char.toUpperCase() === word[i]) {
        word.splice(i, 1, word[i].toLowerCase());
      } else {
        word.splice(i, 1, word[i].toUpperCase());
      }
    }

    return word.join('');
  }

  function removeTag(tagName) {
    const updatedTags = tags.filter((tag) => tag !== tagName);
    setTags(updatedTags);
  }

  function addTag() {
    if (input.trim() !== '') {
      if (tags.includes(input)) return;
      setTags((prevTags) => [input, ...prevTags]);
      setInput('');
      setSpanValue('');
    }
    tagInput.focus();
  }

  function handleInputChange(event) {
    setInput(event.target.value);
    handleAutocomplete();
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
    if (event.key === 'Tab' && input) {
      event.preventDefault();
      if (spanValue) {
        setInput(spanValue);
      }
      setSpanValue('');
    }
  }

  function displayTag(tag, index) {
    return (
      <button type="button" key={index} className="tag" onClick={() => removeTag(tag)}>
        <p>{tag}</p>
      </button>
    );
  }

  return (
    <div className="input-group tags-input-group">
      <div className="input-group">
        <label htmlFor="tag-input">Input Tags</label>
        <div className="inputs">
          <div className="input-wrapper">
            <input
              type="text"
              name="tag-input"
              id="tag-input"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Insert tags here"
            />
          </div>
          <span id="autocomplete-span">{spanValue}</span>
          <button type="button" onClick={addTag}>Add Tag</button>

        </div>
      </div>
      <div className="tags-container">
        {tags.map((tag, index) => (
          displayTag(tag, index)
        ))}
      </div>
    </div>
  );
}

export default FormInput;
