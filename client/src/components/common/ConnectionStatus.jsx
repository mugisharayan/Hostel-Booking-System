import React, { useState, useEffect } from 'react';
import apiService from '../../service/api.service';

const ConnectionStatus = () => {
  const [status, setStatus] = useState({ server: 'checking', database: 'checking' });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Test server connection
        const response = await fetch('/api/test');
        if (response.ok) {
          setStatus(prev => ({ ...prev, server: 'connected' }));
          
          // Test database connection
          try {
            const healthResponse = await fetch('/api/health');
            const healthData = await healthResponse.json();
            setStatus(prev => ({ 
              ...prev, 
              database: healthData.database === 'connected' ? 'connected' : 'disconnected' 
            }));
          } catch (dbError) {
            setStatus(prev => ({ ...prev, database: 'disconnected' }));
          }
        } else {
          setStatus({ server: 'disconnected', database: 'disconnected' });
        }
      } catch (error) {
        setStatus({ server: 'disconnected', database: 'disconnected' });
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'disconnected': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      default: return 'Checking...';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      padding: '8px 12px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontSize: '12px',
      zIndex: 1000,
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(status.server)
        }}></div>
        <span>Server: {getStatusText(status.server)}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(status.database)
        }}></div>
        <span>Database: {getStatusText(status.database)}</span>
      </div>
    </div>
  );
};

export default ConnectionStatus;
