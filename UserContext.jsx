import React, {
  createContext, useState, useMemo, useEffect,
} from 'react';

const UserContext = createContext();

function UserProvider({ children }) {
  const [activeUser, setActiveUser] = useState('');
  // useEffect(() => {
  //   console.log('Active user is now:');
  //   console.log(activeUser);
  // }, [activeUser]);
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
