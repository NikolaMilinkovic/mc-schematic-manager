import React from 'react';
import './loading.scss';

function Loading({ zIndex, text = 'Loading...', background = true }) {
  const style = {
    background: background ? 'var(--background-gradient)' : 'linear-gradient(to right, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.1) 100%)',
    zIndex,
  };
  return (
    <div className="load-gif-container" style={style}>
      {/* <div className="loading-background-overlay" /> */}
      <div className="gif-container">
        <img className="load-gif" src="\gif\pedro.webp" alt="test" />
      </div>
      <h2 className="load-gif-text">{text}</h2>
    </div>
  );
}

export default Loading;
