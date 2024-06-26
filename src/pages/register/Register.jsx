import React, { useState, useEffect, useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import FormInput from '../../util-components/FormInput';
import './register.scss';
import { notifyError } from '../../util-components/Notifications';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

function Register() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
  });
  const [error, setError] = useState(' ');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = cookies.get('token');
    if (token) {
      navigate('/');
    }
  }, []);

  function onChange(event) {
    const { name, value } = event.target;
    if (name === 'email') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value.toLowerCase(),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  }

  useEffect(() => {
    if (formData.password !== formData.passwordRepeat) {
      setError('Passwords do not match!');
    }
    if (formData.password === formData.passwordRepeat) {
      setError('');
    }
  }, [formData]);

  async function registerUser(event) {
    event.preventDefault();

    if (!formData.username) {
      setError('Please enter your username.');
      return null;
    }
    if (!formData.email) {
      setError('Please enter your email.');
      return null;
    }
    if (!formData.password) {
      setError('Please enter your password.');
      return null;
    }
    if (!formData.passwordRepeat) {
      setError('Please enter your password.');
      return null;
    }

    if (formData.password !== formData.passwordRepeat) {
      setError('Passwords do not match!');
      return null;
    }

    fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          return response.json().then((data) => {
            if (response.status === 409) {
              notifyError(data.message);
            }
            throw new Error(data.message || 'Unknown error occurred.');
          });
        }
        return response.json();
      })
      .then(() => {
        setSuccess(true);

        setTimeout(() => {
          navigate('/login');
        }, 1500);
      })
      .catch((err) => {
        setError(err.message);
        console.error(err);
      });
  }

  return (
    <body className="register-body">
      {success && (
        <div className="modal">
          <div className="success-message-container">
            <p className="success-message">Registration successfully completed!</p>
            <div className="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#000000" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" /></svg>
            </div>
            <p className="redirect-message">Redirecting...</p>
          </div>
        </div>
      )}
      <form method="POST" action="" className="login-form" onSubmit={registerUser}>
        <h1 className="hero-text">Register</h1>
        <FormInput
          label="Username"
          id={uuid()}
          name="username"
          type="text"
          placeholder=""
          required
          text={formData.username}
          onChange={(e) => onChange(e)}
        />
        <FormInput
          label="Email"
          id={uuid()}
          name="email"
          type="email"
          placeholder=""
          required
          text={formData.email}
          onChange={(e) => onChange(e)}
        />
        <FormInput
          label="Password"
          id={uuid()}
          name="password"
          type="password"
          placeholder=""
          required
          text={formData.password}
          onChange={(e) => onChange(e)}
        />
        <FormInput
          label="Repeat Password"
          id={uuid()}
          name="passwordRepeat"
          type="password"
          placeholder=""
          required
          text={formData.passwordRepeat}
          onChange={(e) => onChange(e)}
        />

        <pre className="error-message">{error}</pre>

        <button type="submit" className="btn-submit">Register</button>
        <p className="register-link-container">
          <Link to="/login">
            <span className="register-link">
              Login here!
            </span>
          </Link>
        </p>

      </form>
      <p className="copyright">©2024 Gold Studios, All right reserved.</p>
      <div className="background-overlay" />
    </body>
  );
}

export default Register;
