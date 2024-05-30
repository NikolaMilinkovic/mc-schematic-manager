import React, { useEffect, useState } from 'react';
import './imgInputComponent.scss';

function ImgInputComponent({
  reference, key, label = 'Upload image', schematicObj = '',
}) {
  const [text, setText] = useState(label);
  const [imageDisplay, setImageDisplay] = useState('');
  const [displayState, setDisplayState] = useState(false);
  const [arrowState, setArrowState] = useState('rotateX(0deg)');

  function toggleImgPreview() {
    if (displayState === false) {
      setDisplayState(true);
      setArrowState('rotateX(180deg)');
    } else {
      setDisplayState(false);
      setArrowState('rotateX(0deg)');
    }
  }

  function handleButtonClick() {
    if (reference.current) {
      reference.current.click();
    }
  }

  function handleUpload(event) {
    const file = event.target.files[0];
    if (file && file.name) {
      setText(file.name);
      setDisplayState(true);
      setArrowState('rotateX(180deg)');
      setImageDisplay(URL.createObjectURL(file));
    }
  }

  useEffect(() => {
    console.log(schematicObj);
    if (schematicObj !== '') {
      setImageDisplay(schematicObj.image.url);
      // reference.current.value = 'Test';
      const newText = `${schematicObj.name} image`;
      setText(newText);
      setDisplayState(true);
    }
  }, [schematicObj]);

  function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      reference.current.files = dataTransfer.files;

      // Manually trigger the onChange event
      const changeEvent = new Event('change', { bubbles: true });
      reference.current.dispatchEvent(changeEvent);
    }
  }

  return (
    <>
      <div className="image-input-container">
        <button
          onClick={handleButtonClick}
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          type="button"
          className="image-input-button"
        >
          {text}
          <input
            key={key}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            id="image-input"
            ref={reference}
          />
        </button>
      </div>

      <div
        className="image-container"
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <button
          type="button"
          onClick={toggleImgPreview}
          className="toggle-preview-btn"
        >
          <img
            className="toggle-preview-icon"
            style={{ transform: `${arrowState}` }}
            src="/icons/angle-down-solid.svg"
            alt="Toggle preview"
          />
        </button>
        {imageDisplay && displayState
          ? (
            <img
              src={imageDisplay}
              alt="Preview"
            />
          )
          : ''}
      </div>
    </>

  );
}

export default ImgInputComponent;
