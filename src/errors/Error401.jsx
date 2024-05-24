import React from 'react';
import { Link } from 'react-router-dom';
import './error.scss';

function Error() {
  return (
    <main id="errors">
      <h1>Error 401 (Unauthorized)</h1>
      <p>
        You are not authorized to view this page. Please log in to access this
        page.
      </p>
      <Link to="/login">
        <button type="button">Go to Log In page</button>
      </Link>
    </main>
  );
}

export default Error;
