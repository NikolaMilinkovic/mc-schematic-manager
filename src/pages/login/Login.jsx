import { useState, React, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import FormInput from '../../util-components/FormInput';

import './login.scss';

function Login() {
  const navigate = useNavigate();
  const cookies = new Cookies();

  useEffect(() => {
    const token = cookies.get('token');
    if (token) {
      navigate('/');
    }
  }, []);

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

    fetch('http://localhost:3000/login', {
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
          navigate('/');
        }
      })
      .catch((err) => {
        setError('An error occurred while logging in. Server might be down. Call Helvos!');
        console.log(err);
      });
  }

  return (
    <>
      <form method="POST" action="" className="login-form">
        <h1 className="hero-text">Login</h1>
        <FormInput
          label="Username"
          id={uuid()}
          name="username"
          type="text"
          placeholder=""
          required
          onChange={onChange}
        />
        <FormInput
          label="Password"
          id={uuid()}
          name="password"
          type="password"
          placeholder=""
          required
          onChange={onChange}
        />
        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn-submit" onClick={loginUser}>Login</button>
      </form>
      <p className="copyright">©2024 Gold Studios, All right reserved.</p>
      <img src="\img\login-background-1920x1080.jpg" alt="test" />
      <div className="background-overlay" />
    </>
  );
}

export default Login;
