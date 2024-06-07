/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef } from 'react';
import './draggableButton.scss';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function DraggableButton({ pathString }) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const buttonRef = useRef();

  // Fetch schematics when component mounts
  useEffect(() => {
    function dragEnd(event) {
      if (buttonRef.current) {
        buttonRef.current.style.left = `calc(${event.clientX}px - 50px)`;
        buttonRef.current.style.top = `calc(${event.clientY}px - 50px)`;
      }
    }

    function drop(event) {
      event.preventDefault();
      buttonRef.current.style.left = `${event.clientX}px`;
      buttonRef.current.style.top = `${event.clientY}px`;
    }

    buttonRef.current.addEventListener('dragend', dragEnd);
    buttonRef.current.addEventListener('drop', drop);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
      buttonRef.current.style.top = `calc(${window.innerHeight}px - 150px)`;
      buttonRef.current.style.left = `calc(${window.innerWidth}px - 150px)`;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="plus-button"
      ref={buttonRef}
      draggable
    >
      <Link
        to={pathString}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#ffffff" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg>
      </Link>
    </div>
  );
}

export default DraggableButton;
