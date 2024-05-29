import React, { useState } from 'react';
import './fileInputComponent.scss';

function FileInput({ reference }) {
  const [text, setText] = useState('Upload File');

  function handleUpload(event) {
    const file = event.target.files[0];
    if (file && file.name) {
      setText(file.name);
    }
  }

  function handleButtonClick() {
    if (reference.current) {
      reference.current.click();
    }
  }

  return (
    <div className="file-input-container">
      <button onClick={handleButtonClick} type="button" className="file-input-button">
        {text}
        <input type="file" onChange={handleUpload} id="file-input" accept=".schematic, .schem, .zip" ref={reference} />
      </button>
    </div>
  );
}

export default FileInput;
