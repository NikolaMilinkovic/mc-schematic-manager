import { useState, React, useEffect } from 'react';
import './dashboard.scss';
import Loading from '../../components/loading/Loading';
import Landing from '../../components/landing/Landing';
import customFetch from '../../../fetchMethod';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

function Dashboard({ schematicsFilter }) {
  const [loading, setLoading] = useState(true);
  const [schematics, setSchematics] = useState();

  async function fetchSchematics() {
    try {
      customFetch('/get-schematics', 'POST')
        .then((data) => setSchematics(data));
    } catch (err) {
      console.error('Error fetching schematics ', err);
    }
  }

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('hasLoaded');
    if (hasLoaded) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('hasLoaded', 'true');
      }, 1500);
    }

    fetchSchematics();
  }, []);

  return (
    <body className="dashboard-body">
      {loading && <Loading zIndex="1000" />}
      <div className="dashboard-container">
        <Landing schematicsFilter={schematicsFilter} />
      </div>
    </body>

  );
}

export default Dashboard;
