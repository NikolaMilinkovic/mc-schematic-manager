import React, { useState, useEffect } from 'react';
import './fileInputComponent.scss';

function FileInput({
  reference, label, reset,
}) {
  const [text, setText] = useState(label);

  function handleUpload(event) {
    const file = event.target.files[0];
    if (file && file.name) {
      setText(file.name);
    } else {
      setText(label);
    }
  }

  function handleButtonClick() {
    if (reference.current) {
      reference.current.click();
    }
  }

  // Using Reducer method causes a rerender upon upload
  useEffect(() => {
    if (reset) {
      setText('Upload File');
    }
  }, [reset]);

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
