/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef } from 'react';
import './draggableButton.scss';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function DraggableButton({ pathString, onClick }) {
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
      if (window.innerWidth > 800) {
        buttonRef.current.style.top = `calc(${window.innerHeight}px - 150px)`;
        buttonRef.current.style.left = `calc(${window.innerWidth}px - 150px)`;
      }
      if (window.innerWidth > 550 && window.innerWidth < 800) {
        buttonRef.current.style.top = `calc(${window.innerHeight}px - 100px)`;
        buttonRef.current.style.left = `calc(${window.innerWidth}px - 100px)`;
      }
      if (window.innerWidth < 550) {
        buttonRef.current.style.top = `calc(${window.innerHeight}px - 85px)`;
        buttonRef.current.style.left = `calc(${window.innerWidth}px - 85px)`;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Drag & Drop for mobile phones
  const buttonPositionRef = useRef({ x: 0, y: 0 });

  // useEffect(() => {
  //   let startX = 0;
  //   let startY = 0;

  //   function onTouchStart(event) {
  //     event.preventDefault();
  //     const touch = event.touches[0];
  //     startX = touch.clientX;
  //     startY = touch.clientY;
  //   }

  //   function onTouchMove(event) {
  //     event.preventDefault();
  //     if (buttonRef.current) {
  //       const touch = event.touches[0];
  //       const deltaX = touch.clientX - startX;
  //       const deltaY = touch.clientY - startY;
  //       const newTranslateX = buttonPositionRef.current.x + deltaX;
  //       const newTranslateY = buttonPositionRef.current.y + deltaY;
  //       buttonRef.current.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px)`;
  //     }
  //   }

  //   function onTouchEnd(event) {
  //     if (buttonRef.current) {
  //       buttonRef.current.style.transform = 'none';
  //       const touch = event.changedTouches[0];
  //       const targetField = document.elementFromPoint(touch.clientX, touch.clientY);
  //       // Do something with targetField if needed

  //       // Update the button position reference
  //       const rect = buttonRef.current.getBoundingClientRect();
  //       buttonPositionRef.current = {
  //         x: rect.left,
  //         y: rect.top,
  //       };
  //     }
  //   }

  //   const button = buttonRef.current;
  //   if (button) {
  //     button.addEventListener('touchstart', onTouchStart);
  //     button.addEventListener('touchmove', onTouchMove, { passive: false });
  //     button.addEventListener('touchend', onTouchEnd);
  //     // Add event listener for touch cancel if needed
  //   }

  //   return () => {
  //     if (button) {
  //       button.removeEventListener('touchstart', onTouchStart);
  //       button.removeEventListener('touchmove', onTouchMove, { passive: false });
  //       button.removeEventListener('touchend', onTouchEnd);
  //       // Remove event listener for touch cancel if added
  //     }
  //   };
  // }, []);

  function onClickPlaceholder() {

  }
  return (
    <div
      className="plus-button"
      ref={buttonRef}
      draggable
      onClick={onClick || onClickPlaceholder}
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
