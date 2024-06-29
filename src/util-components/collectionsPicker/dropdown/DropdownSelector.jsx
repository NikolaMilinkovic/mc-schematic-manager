/* eslint-disable jsx-a11y/click-events-have-key-events */
import './dropdownSelector.scss';
import React, { useEffect, useState, useRef } from 'react';

function DropdownSelector({ data, selectItem }) {
  const [state, setState] = useState(false);
  const [arrowState, setArrowState] = useState(false);
  const wrapper = useRef(null);
  function toggleStates() {
    setState(!state);
    setArrowState(!arrowState);
  }

  useEffect(() => {
    /**
       * Alert if clicked on outside of element
       */
    function handleClickOutside(event) {
      if (wrapper.current && !wrapper.current.contains(event.target)) {
        if (state === true && arrowState === true) {
          setState(!state);
          setArrowState(!arrowState);
        }
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapper, state, arrowState]);

  return (
    <div className="dropdown-wrapper" ref={wrapper}>
      <div className="main-button">
        <button
          type="button"
          onClick={() => toggleStates()}
        >
          <p>
            Browse collections
          </p>
          <img
            className="toggle-preview-icon"
            style={{ transform: state ? 'rotateX(180deg)' : 'rotateX(0deg)' }}
            src="/icons/angle-down-solid.svg"
            alt="Toggle preview"
          />
        </button>
      </div>
      <div
        className="dropdown-elements"
        style={{
          opacity: state ? 1 : 0,
          pointerEvents: state ? 'all' : 'none',
        }}
      >
        {data && (
          data.map((set) => (
            <button
              className="item"
              type="button"
              key={set.collection_id}
              name={set.collection_id}
              onClick={(e) => selectItem(e)}
            >
              {set.collection_name}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default DropdownSelector;
