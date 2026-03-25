import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [zones, setZones] = useState([]);
  const [alerts, setAlerts] = useState([]);

  return (
    <AppContext.Provider value={{ user, setUser, zones, setZones, alerts, setAlerts }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
