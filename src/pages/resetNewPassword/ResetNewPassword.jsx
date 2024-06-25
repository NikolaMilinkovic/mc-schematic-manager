import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../util-components/FormInput';
import './resetNewPassword.scss';
import { notifySuccess, notifyError } from '../../util-components/Notifications';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

function ResetNewPassword() {
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [error, setError] = useState(' ');
  const navigate = useNavigate();

  useEffect(() => {
    if (password !== passwordRepeat) {
      setError('Passwords do not match!');
    }
    if (password === passwordRepeat) {
      setError(' ');
    }
  }, [password, passwordRepeat]);

  async function updatePassword(event) {
    event.preventDefault();
    if (password !== passwordRepeat) return notifyError('Passwords must match!');

    try {
      const token = window.location.pathname.split('/').pop();

      const response = await fetch(`${apiUrl}/new-password/${token}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      const { status } = response;
      const data = await response.json();

      if (status === 200) {
        notifySuccess(data.message);
        return navigate('/login');
      }
      notifyError(data.message);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <body className="reset-password-body">
      <form method="PATCH" action="" className="reset-password-form" onSubmit={updatePassword}>
        <h1 className="hero-text">Password Reset</h1>
        <FormInput
          label="Password"
          id={uuid()}
          name="password"
          type="password"
          placeholder=""
          required
          text={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormInput
          label="Repeat Password"
          id={uuid()}
          name="password-repeat"
          type="password"
          placeholder=""
          required
          text={passwordRepeat}
          onChange={(e) => setPasswordRepeat(e.target.value)}
        />
        <pre className="error-message">{error || '\u00A0'}</pre>

        <button type="submit" className="btn-submit">SUBMIT</button>
      </form>
      <p className="copyright">©2024 Gold Studios, All right reserved.</p>
      <div className="background-overlay" />
    </body>
  );
}

export default ResetNewPassword;
