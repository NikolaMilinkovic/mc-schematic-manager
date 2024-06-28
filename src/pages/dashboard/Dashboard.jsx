import {
  useState, React, useEffect, useRef,
} from 'react';
import './dashboard.scss';
import Loading from '../../components/loading/Loading';
import Landing from '../../components/landing/Landing';
import UploadSchematicPopup from '../uploadSchematic/uploadSchematicPopup/UploadSchematicPopup';
import DraggableButton from '../../components/DraggableButton/DraggableButton';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

function Dashboard({ schematicsFilter }) {
  const [loading, setLoading] = useState(true);

  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = (e) => {
    setScrollPosition(e.target.scrollTop);
  };

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
  }, []);
  const [ModalState, setModalState] = useState(false);
  function toggleUploadModal() {
    setModalState((prevState) => !prevState);
    console.log(ModalState);
  }


  return (
    <body
      className="dashboard-body"
      onScroll={(e) => handleScroll(e)}
    >
      {loading && <Loading zIndex="1000" />}
      <div className="dashboard-container">
        <Landing schematicsFilter={schematicsFilter} />
        <div className="background-overlay-dashboard" />

        <UploadSchematicPopup
          state={ModalState}
          toggleState={() => toggleUploadModal()}
          scrollOffset={scrollPosition}
        />
      </div>

      <DraggableButton
        pathString="/"
        onClick={() => toggleUploadModal()}
        state={ModalState}
      />

    </body>
  );
}

export default Dashboard;
