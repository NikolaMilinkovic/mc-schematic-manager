import React from 'react';
import './loading.scss';

function Loading({ zIndex, text = 'Loading...' }) {
  return (
    <div className="load-gif-container" style={{ zIndex }}>
      <div className="gif-container">
        <img className="load-gif" src="\gif\pedro.webp" alt="test" />
      </div>
      <h2 className="load-gif-text">{text}</h2>
    </div>
  );
}

export default Loading;
