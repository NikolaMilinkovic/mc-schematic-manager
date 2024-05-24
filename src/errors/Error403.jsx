import React from 'react';
import { Link } from 'react-router-dom';

import './error.scss';

function Error() {
  return (
    <main id="errors">
      <h1>Error 403 (Forbidden)</h1>
      <p>
        You are not authorized to view this page. Please return to the home
        page.
      </p>
      <Link to="/" replace>
        <button type="button">Back to home</button>
      </Link>
    </main>
  );
}

export default Error;
