import React, { useState, useEffect, useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import FormInput from '../../util-components/FormInput';
import './login.scss';
import { UserContext } from '../../../UserContext';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

function Login() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const { activeUser, handleSetActiveUser } = useContext(UserContext);

  useEffect(() => {
    const token = cookies.get('token');
    // const storedUser = localStorage.getItem('activeUser');
    // if (storedUser) {
    //   localStorage.removeItem('activeUser');
    // }
    if (token) {
      navigate('/');
    }
  }, [cookies, navigate]);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(' ');

  function onChange(event) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function loginUser(event) {
    event.preventDefault();

    if (!formData.username) {
      setError('Please enter your username.');
      return null;
    }
    if (!formData.password) {
      setError('Please enter your password.');
      return null;
    }

    fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status === 401) {
          setError('Username or password is incorrect.');
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.token) {
          cookies.set('token', data.token, { path: '/', maxAge: 365 * 24 * 60 * 60 });
          handleSetActiveUser(data.user);
          localStorage.setItem('activeUser', JSON.stringify(data.user));

          setTimeout(() => {
            navigate('/');
          }, 1000);
        }
      })
      .catch((err) => {
        setError('An error occurred while logging in. Server might be down. Call Helvos!');
        console.error(err);
      });
  }

  return (
    <body className="login-body">
      <form method="POST" action="" className="login-form" onSubmit={loginUser}>
        <h1 className="hero-text">LogIn</h1>
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
          label="Password"
          id={uuid()}
          name="password"
          type="password"
          placeholder=""
          required
          text={formData.password}
          onChange={(e) => onChange(e)}
        />

        <div className="error-message">{error}</div>

        <button type="submit" className="btn-submit">Login</button>
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

export default Login;
