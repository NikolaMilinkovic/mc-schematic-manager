/* eslint-disable react/jsx-no-bind */
import {
  React, useRef, useState, useEffect, useContext,
} from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import './navbar.scss';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import ProfileDropDown from './profileMenu/ProfileDropDown';

function Navbar({ navActive, setNavActive, setSchematicsFilter }) {
  const navRef = useRef();
  const [prevScrollPos, setScrollPos] = useState(window.scrollY);
  const [transformY, setTransformY] = useState(0);
  const location = useLocation();
  const [userData, setUserData] = useState();

  function filterSchematics(e) {
    setSchematicsFilter(e.target.value);
    if (!e.target.value) {
      setSchematicsFilter('');
    }
  }

  // ===============================[DOCUMENTATION]=============================== //
  // Za svako dugme potrebno je update sledece:
  // - Use Effect dodati else if
  // - Staviti odgovarajuci name parametar
  // ===============================[\DOCUMENTATION]=============================== //

  // Sets active element on path change
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setNavActive('home');
    } else if (path === '/upload-schematic') {
      setNavActive('upload-schematic');
    } else if (path === '/link') {
      setNavActive('link');
    } else if (path === '/profile') {
      setNavActive('profile');
    } else if (path === '/collections') {
      setNavActive('collection');
    } else {
      setNavActive('');
    }
  }, [location.pathname, setNavActive]);

  // Updates the active element
  function updateNav(event) {
    console.log('Updating nav on click');
    if (event.target.name) {
      const { name } = event.target;
      setNavActive(name);
    }
  }

  // Handles navbar show/hide func
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

  return (
    <header style={{ transform: `translateY(${transformY}px)` }}>

      <nav ref={navRef}>
        <input type="text" className="search-input" onChange={(e) => filterSchematics(e)} placeholder="Search by name / tag" />
        <button type="button" className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>

        {/* HOME BUTTON */}
        <Link
          onClick={updateNav}
          className={navActive === 'home' ? 'nav-active' : ''}
          name="home"
          to="/"
        >
          Browse
        </Link>

        {/* COLLECTIONS BUTTON */}
        <Link
          onClick={updateNav}
          className={navActive === 'collections' ? 'nav-active' : ''}
          name="collections"
          to="/collections"
        >
          Collections
        </Link>

        {/* UPLOAD BUTTON */}
        <Link
          onClick={updateNav}
          className={navActive === 'upload-schematic' ? 'nav-active' : ''}
          name="upload-schematic"
          to="/upload-schematic"
        >
          Upload schematic
        </Link>

        <ProfileDropDown />
      </nav>
      <button type="button" className="nav-btn" onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
}

export default Navbar;
