import React, { useState, useEffect } from 'react';

const OfflineNotice = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await fetch('/api/test', { method: 'HEAD' });
        setIsOffline(false);
      } catch {
        setIsOffline(true);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isOffline) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: '#f59e0b',
      color: 'white',
      padding: '8px 16px',
      textAlign: 'center',
      fontSize: '14px',
      zIndex: 10000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <i className="fas fa-wifi" style={{ marginRight: '8px' }}></i>
      Running in offline mode - Data saved locally
    </div>
  );
};

export default OfflineNotice;
