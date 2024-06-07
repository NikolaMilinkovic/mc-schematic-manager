import { useState, React } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer, Bounce } from 'react-toastify';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedAuth from './pages/auth/ProtectedAuth';
import Error401 from './errors/Error401';
import Error403 from './errors/Error403';
import Error404 from './errors/Error404';
import UploadSchematic from './pages/uploadSchematic/UploadSchematic';
import Navbar from './components/Navbar';
import EditSchematic from './pages/editSchematic/EditSchematic';
import { UserProvider } from '../UserContext';

function App() {
  const [navActive, setNavActive] = useState('');
  const [schematicsFilter, setSchematicsFilter] = useState('');

  return (
    <BrowserRouter basename="/">
      <UserProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
          className="toast-container"
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={(
              <ProtectedAuth>
                <Navbar navActive={navActive} setNavActive={setNavActive} setSchematicsFilter={setSchematicsFilter} />
                <Dashboard schematicsFilter={schematicsFilter} />
              </ProtectedAuth>
        )}
          />
          <Route
            path="/upload-schematic"
            element={(
              <ProtectedAuth>
                <Navbar navActive={navActive} setNavActive={setNavActive} />
                <UploadSchematic />
              </ProtectedAuth>
        )}
          />
          {/* <Route path="/edit-schematic/:id" element={<EditSchematic />} /> */}
          <Route
            path="/edit-schematic/:id"
            element={(
              <ProtectedAuth>
                <Navbar navActive={navActive} setNavActive={setNavActive} />
                <EditSchematic />
              </ProtectedAuth>
        )}
          />

          <Route path="/error/401" element={<Error401 />} />
          <Route path="/error/403" element={<Error403 />} />
          <Route path="/error/404" element={<Error404 />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
