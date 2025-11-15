import React, { useState, useEffect } from 'react';
import custodianService from '../../service/custodian.service';

const CustodianNotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await custodianService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'payment':
        return 'fa-credit-card';
      case 'maintenance':
        return 'fa-wrench';
      default:
        return 'fa-bell';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal-content" style={{ maxWidth: '500px', width: '90vw' }}>
        <div className="modal-header">
          <h3><i className="fas fa-bell"></i> Notifications</h3>
          <button className="close-modal-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="notification-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <i className="fas fa-spinner fa-spin"></i> Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <i className="fas fa-bell-slash" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
              <h4>No notifications</h4>
              <p>You're all caught up!</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div key={notification.id} className="notification-item" style={{ 
                padding: '16px', 
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: notification.type === 'payment' ? '#10b981' : '#f59e0b',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className={`fas ${getNotificationIcon(notification.type)}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>
                    {notification.title}
                  </h5>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b' }}>
                    {notification.message}
                  </p>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustodianNotificationCenter;