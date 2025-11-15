import React, { useState } from 'react';

const StudentNotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'payment', title: 'Payment Reminder', message: 'Your rent payment is due in 3 days', time: '2 hours ago', unread: true },
    { id: 2, type: 'maintenance', title: 'Maintenance Update', message: 'Your maintenance request has been approved and scheduled', time: '1 day ago', unread: true },
    { id: 3, type: 'room', title: 'Room Inspection', message: 'Room inspection scheduled for tomorrow at 10 AM', time: '2 days ago', unread: false },
    { id: 4, type: 'announcement', title: 'Hostel Announcement', message: 'Wi-Fi maintenance scheduled for this weekend', time: '3 days ago', unread: false }
  ]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal-content notification-center-modal">
        <div className="modal-header">
          <h3><i className="fas fa-bell"></i> Notifications</h3>
          <div className="header-actions">
            <button onClick={markAllAsRead} className="btn-link">Mark all read</button>
            <button className="close-modal-btn" onClick={onClose}>&times;</button>
          </div>
        </div>
        
        <div className="notification-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.unread ? 'unread' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="notification-icon">
                <i className={`fas ${
                  notification.type === 'payment' ? 'fa-credit-card' :
                  notification.type === 'maintenance' ? 'fa-wrench' :
                  notification.type === 'room' ? 'fa-door-open' :
                  'fa-bullhorn'
                }`}></i>
              </div>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
              {notification.unread && <div className="unread-dot"></div>}
            </div>
          ))}
        </div>
        
        {notifications.length === 0 && (
          <div className="empty-notifications">
            <i className="fas fa-bell-slash"></i>
            <p>No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentNotificationCenter;