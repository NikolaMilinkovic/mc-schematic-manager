/* eslint-disable react/jsx-no-bind */
import {
  React, useRef, useState, useEffect, useContext,
} from 'react';
import './profileDropDown.scss';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { UserContext } from '../../../UserContext';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

function ProfileDropDown() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { activeUser, handleSetActiveUser } = useContext(UserContext);
  const [dropdownState, setDropdownState] = useState('closed');
  const [arrowState, setArrowState] = useState('rotateX(0deg)');
  const dropdownRef = useRef();
  const profileBtnRef = useRef();

  // Closes the dropdown when clicked outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (!dropdownRef.current.contains(event.target)
      && !profileBtnRef.current.contains(event.target)
      ) {
        setDropdownState('closed');
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Handles dropdown state
  function toggleProfileState() {
    if (dropdownState === 'open') {
      setDropdownState('closed');
      setArrowState('rotateX(180deg)');
    } else {
      setDropdownState('open');
      setArrowState('rotateX(0deg)');
    }
  }

  // Remove the cookie and go to login page
  async function logOut(event) {
    try {
      event.preventDefault();
      cookies.remove('token', { path: '/' });
      sessionStorage.removeItem('hasLoaded');
      localStorage.removeItem('activeUser');
      navigate('/login');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="profile-container">
      <button id="profile-btn" onClick={toggleProfileState} type="button" ref={profileBtnRef}>
        <img
          className="toggle-preview-icon"
          style={{ transform: `${arrowState}` }}
          src="/icons/angle-down-solid.svg"
          alt="Toggle preview"
        />
        Profile
      </button>

      <ul className={`${dropdownState} dropdown-container`} ref={dropdownRef}>
        {activeUser && activeUser.permissions.profile.view_profile === true && (
        <Link to={`/profile/${activeUser._id}`}>
          <li>
            <span className="">
              Profile
            </span>
          </li>
        </Link>
        ) }

        <Link to="/settings">
          <li>
            <span className="">
              Settings
            </span>
          </li>
        </Link>
        <button type="button" className="log-out" onClick={logOut}>Log out</button>
      </ul>
    </div>
  );
}

export default ProfileDropDown;
