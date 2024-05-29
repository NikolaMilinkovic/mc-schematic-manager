import React from 'react';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';

function ProtectedAuth({ children }) {
  const cookies = new Cookies(null, { path: '/' });
  const token = cookies.get('token');

  if (!token || token === null || token === undefined) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
export default ProtectedAuth;
