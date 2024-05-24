import {
  React, useRef, useState, useEffect,
} from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import './navbar.scss';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

function Navbar() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const navRef = useRef();
  const [prevScrollPos, setScrollPos] = useState(window.scrollY);
  const [transformY, setTransformY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const screenWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
      if (screenWidth > 1024) {
        const currentScrollPos = window.scrollY;

        if (currentScrollPos > 80) {
          if (prevScrollPos > currentScrollPos) {
            setTransformY(0);
          } else {
            setTransformY(-80);
          }
        }
        setScrollPos(currentScrollPos);
      }
    };
    window.addEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const showNavbar = () => {
    navRef.current.classList.toggle('responsive_nav');
  };

  // Remove the cookie and go to login page
  function logOut(event) {
    event.preventDefault();
    cookies.remove('token');
    navigate('/login');
  }

  return (
    <header style={{ transform: `translateY(${transformY}px)` }}>
      <nav ref={navRef}>
        <button type="button" className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
        <button type="button" onClick={logOut}>Log out</button>
        <Link to="/">Login Page</Link>
        <Link to="/dashboard">Link</Link>
        <Link to="/dashboard">Link</Link>
        <Link to="/dashboard">Link</Link>
      </nav>
      <button type="button" className="nav-btn" onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
}

export default Navbar;
