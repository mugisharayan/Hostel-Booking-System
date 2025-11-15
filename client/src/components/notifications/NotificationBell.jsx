import React, { useState } from 'react';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, type: 'payment', title: 'New Payment Submitted', message: 'Jane Doe submitted payment for Room A-104', time: '2 min ago', unread: true },
    { id: 2, type: 'maintenance', title: 'Urgent Maintenance Request', message: 'Leaking pipe in Room B-02', time: '15 min ago', unread: true },
    { id: 3, type: 'room', title: 'Room Assignment Due', message: '3 students waiting for room assignment', time: '1 hour ago', unread: true }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const getIcon = (type) => {
    switch (type) {
      case 'payment': return 'fa-dollar-sign';
      case 'maintenance': return 'fa-wrench';
      case 'room': return 'fa-key';
      default: return 'fa-bell';
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: 'none', 
          border: 'none', 
          fontSize: '20px', 
          color: '#64748b', 
          cursor: 'pointer',
          position: 'relative',
          padding: '8px'
        }}
      >
        <i className="fa-solid fa-bell"></i>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          width: '320px',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          zIndex: 1000,
          marginTop: '8px'
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Notifications</h4>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{unreadCount} new</span>
          </div>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  gap: '12px',
                  cursor: 'pointer',
                  background: notification.unread ? '#f8fafc' : 'white'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#0ea5e9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  <i className={`fa-solid ${getIcon(notification.type)}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>{notification.title}</h5>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>{notification.message}</p>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;