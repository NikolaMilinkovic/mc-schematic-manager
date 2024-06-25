import React, {
  createContext, useState, useMemo, useEffect,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';

const UserContext = createContext();

function UserProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeUser, setActiveUser] = useState(() => {
    const storedUser = localStorage.getItem('activeUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // Store active user data in localStorage when it changes
    if (activeUser) {
      localStorage.setItem('activeUser', JSON.stringify(activeUser));
    } else {
      const cookies = new Cookies();
      cookies.remove('token', { path: '/' });
      if (location.pathname === '/register') return;
      if (location.pathname === '/reset-password') return;
      console.log(location.pathname.split('/'));
      if (location.pathname.includes('/set-new-password/')) return;
      navigate('/login');
    }
  }, [activeUser, navigate, location.pathname]);

  function handleSetActiveUser(user) {
    setActiveUser(user);
  }

  const contextValue = useMemo(() => ({ activeUser, handleSetActiveUser }), [activeUser]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
