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

  // Drag & Drop for mobile phones
  useEffect(() => {
    const draggedEl = buttonRef.current;
    let startX = 0;
    let startY = 0;
    let translateX = 0; // New variable to store horizontal translation
    let translateY = 0; // New variable to store vertical translation

    function onTouchStart(event) {
      event.preventDefault();
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    }

    function onTouchMove(event) {
      event.preventDefault();
      if (draggedEl) {
        const touch = event.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        translateX += deltaX; // Accumulate horizontal translation
        translateY += deltaY; // Accumulate vertical translation
        draggedEl.style.transform = `translate(${translateX}px, ${translateY}px)`;
        startX = touch.clientX; // Update start X position
        startY = touch.clientY; // Update start Y position
      }
    }

    function onTouchEnd(event) {
      if (draggedEl) {
        const touch = event.changedTouches[0];
        // Note: Use translateX and translateY to set the final position
        draggedEl.style.transform = `translate(${translateX}px, ${translateY}px)`;
        // Reset translation variables for next interaction
        translateX = 0;
        translateY = 0;
      }
    }

    draggedEl.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      draggedEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove, { passive: false });
      window.removeEventListener('touchend', onTouchEnd);
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
