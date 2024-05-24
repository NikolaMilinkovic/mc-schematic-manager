import { useState, React } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedAuth from './pages/auth/ProtectedAuth';
import Error401 from './errors/Error401';
import Error403 from './errors/Error403';
import Error404 from './errors/Error404';

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={(
            <ProtectedAuth>
              <Dashboard />
            </ProtectedAuth>
        )}
        />

        <Route path="/error/401" element={<Error401 />} />
        <Route path="/error/403" element={<Error403 />} />
        <Route path="/error/404" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
