import React from 'react';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';

function ProtectedAuth({ children }) {
  const cookies = new Cookies(null, { path: '/' });
  const token = cookies.get('token');
  console.log(token);

  if (!token || token === null || token === undefined) {
    console.log('Token not found, redirecting to login page.');
    return <Navigate to="/login" replace />;
  }

  console.log('Token is present.');
  return children;
}
export default ProtectedAuth;
