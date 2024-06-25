import React, { useState, useEffect, useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import FormInput from '../../util-components/FormInput';
import './resetPassword.scss';
import { UserContext } from '../../../UserContext';
import { notifySuccess, notifyError, notifyInfo } from '../../util-components/Notifications';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

function ResetPassword() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const { activeUser, handleSetActiveUser } = useContext(UserContext);

  useEffect(() => {
    const token = cookies.get('token');
    const storedUser = localStorage.getItem('activeUser');
    if (storedUser) {
      localStorage.removeItem('activeUser');
    }
    if (token) {
      navigate('/');
    }
  }, [cookies, navigate]);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(' ');

  function onChange(event) {
    const { value } = event.target;
    setEmail(value);
  }

  async function resetPassword(event) {
    event.preventDefault();
    try {
      if (!email) {
        setError('Please enter your recovery email.');
        return null;
      }

      console.log(apiUrl);
      const response = await fetch(`${apiUrl}/password-reset`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const { status } = response;
      const data = await response.json();

      if (status === 200) {
        notifySuccess(data.message);
      } else {
        notifyError(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <body className="reset-password-body">
      <form method="PATCH" action="" className="reset-password-form" onSubmit={resetPassword}>
        <h1 className="hero-text">LogIn</h1>
        <FormInput
          label="Email"
          id={uuid()}
          name="email"
          type="text"
          placeholder=""
          required
          text={email}
          onChange={(e) => onChange(e)}
        />
        <div className="error-message">{error}</div>

        <button type="submit" className="btn-submit">SUBMIT</button>
        <p className="register-link-container">
          <Link to="/login">
            <span className="register-link">
              Back to Login page
            </span>
          </Link>
        </p>
        <p className="register-link-container">
          <Link to="/register">
            <span className="register-link">
              Register Here!
            </span>
          </Link>
        </p>
      </form>
      <p className="copyright">©2024 Gold Studios, All right reserved.</p>
      <div className="background-overlay" />
    </body>
  );
}

export default ResetPassword;
