import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// Constants
const NOTIFICATION_ICONS = {
  payment: 'fa-dollar-sign',
  maintenance: 'fa-wrench',
  room: 'fa-key',
  default: 'fa-bell'
};

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'payment', title: 'New Payment Submitted', message: 'Jane Doe submitted payment for Room A-104', time: '2 min ago', unread: true },
  { id: 2, type: 'maintenance', title: 'Urgent Maintenance Request', message: 'Leaking pipe in Room B-02', time: '15 min ago', unread: true },
  { id: 3, type: 'room', title: 'Room Assignment Due', message: '3 students waiting for room assignment', time: '1 hour ago', unread: true }
];

const STYLES = {
  container: { position: 'relative', display: 'inline-block' },
  button: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: '#64748b',
    cursor: 'pointer',
    position: 'relative',
    padding: '8px'
  },
  badge: {
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
  },
  dropdown: {
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
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: { margin: 0, fontSize: '16px', fontWeight: '600' },
  headerCount: { fontSize: '12px', color: '#64748b' },
  list: { maxHeight: '300px', overflowY: 'auto' },
  notificationItem: {
    padding: '12px 20px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    gap: '12px',
    cursor: 'pointer'
  },
  icon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: '#0ea5e9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '14px'
  },
  content: { flex: 1 },
  title: { margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' },
  message: { margin: '0 0 4px 0', fontSize: '12px', color: '#64748b', lineHeight: '1.4' },
  time: { fontSize: '11px', color: '#94a3b8' }
};

// Helper functions
const getNotificationIcon = (type) => NOTIFICATION_ICONS[type] || NOTIFICATION_ICONS.default;

const getNotificationItemStyle = (notification) => ({
  ...STYLES.notificationItem,
  background: notification.unread ? '#f8fafc' : 'white'
});

const formatUnreadText = (count) => `${count} new`;

// Components
const NotificationBadge = ({ count }) => {
  if (count <= 0) return null;
  
  return (
    <span style={STYLES.badge}>
      {count}
    </span>
  );
};

NotificationBadge.propTypes = {
  count: PropTypes.number.isRequired
};

const NotificationHeader = ({ unreadCount }) => (
  <div style={STYLES.header}>
    <h4 style={STYLES.headerTitle}>Notifications</h4>
    <span style={STYLES.headerCount}>{formatUnreadText(unreadCount)}</span>
  </div>
);

NotificationHeader.propTypes = {
  unreadCount: PropTypes.number.isRequired
};

const NotificationItem = ({ notification }) => (
  <div style={getNotificationItemStyle(notification)}>
    <div style={STYLES.icon}>
      <i className={`fa-solid ${getNotificationIcon(notification.type)}`}></i>
    </div>
    <div style={STYLES.content}>
      <h5 style={STYLES.title}>{notification.title}</h5>
      <p style={STYLES.message}>{notification.message}</p>
      <span style={STYLES.time}>{notification.time}</span>
    </div>
  </div>
);

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    unread: PropTypes.bool.isRequired
  }).isRequired
};

const NotificationDropdown = ({ notifications, unreadCount }) => (
  <div style={STYLES.dropdown}>
    <NotificationHeader unreadCount={unreadCount} />
    <div style={STYLES.list}>
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  </div>
);

NotificationDropdown.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
  unreadCount: PropTypes.number.isRequired
};

const NotificationBell = ({ notifications = MOCK_NOTIFICATIONS }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => n.unread).length;
  
  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <div style={STYLES.container}>
      <button style={STYLES.button} onClick={toggleDropdown}>
        <i className="fa-solid fa-bell"></i>
        <NotificationBadge count={unreadCount} />
      </button>
      
      {isOpen && (
        <NotificationDropdown 
          notifications={notifications} 
          unreadCount={unreadCount} 
        />
      )}
    </div>
  );
};

NotificationBell.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object)
};

export default NotificationBell;