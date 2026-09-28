import React, { createContext, useContext, useState, useEffect } from 'react';

const OfflineContext = createContext();

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncQueue, setSyncQueue] = useState([]);
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString('ar-DZ'));

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Process sync queue
      setSyncQueue([]);
      setLastSyncTime(new Date().toLocaleTimeString('ar-DZ'));
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const queueAction = (action) => {
    setSyncQueue(prev => [...prev, { ...action, queuedAt: Date.now() }]);
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        syncQueue,
        lastSyncTime,
        queueAction,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);
