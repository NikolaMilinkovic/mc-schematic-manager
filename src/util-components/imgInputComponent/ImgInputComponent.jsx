import React, { useEffect, useState } from 'react';
import './imgInputComponent.scss';
import resizeImage from '../../../util-methods/resizeImage';

function ImgInputComponent({
  reference, rerenderkey, label = 'Click to upload image', schematicObj = '',
}) {
  const [text, setText] = useState(label);
  const [imageDisplay, setImageDisplay] = useState('');
  const [displayState, setDisplayState] = useState(false);
  const [arrowState, setArrowState] = useState('rotateX(0deg)');
  const [imgRerender, setImgRerender] = useState(rerenderkey);
  const [resizedImage, setResizedImage] = useState('');

  useEffect(() => {
    setImageDisplay('');
    setText(label);
  }, [rerenderkey]);

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

  async function handleUpload(event) {
    const file = event.target.files[0];
    if (file && file.name) {
      setText(file.name);
      setDisplayState(true);
      setArrowState('rotateX(180deg)');
      setImageDisplay(URL.createObjectURL(file));
      try {
        const resizedImageUrl = await resizeImage(file);
        setResizedImage(resizedImageUrl);
      } catch (error) {
        console.error('Error resizing image:', error);
      }
    }
  }

  useEffect(() => {
    if (schematicObj !== '') {
      setImageDisplay(schematicObj.image.url);
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
            rerenderkey={rerenderkey}
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
            <div>
              <img
                src={imageDisplay}
                alt="Preview"
              />
            </div>
          )
          : ''}
      </div>
    </>

  );
}

export default ImgInputComponent;
