import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// Constants
const TABS = {
  ALL: 'all',
  UNREAD: 'unread',
  PRIORITY: 'priority',
  ACTIONS: 'actions'
};

const TYPE_ICONS = {
  booking: 'fa-calendar-plus',
  payment: 'fa-credit-card',
  maintenance: 'fa-wrench',
  system: 'fa-cog',
  default: 'fa-bell'
};

const TYPE_COLORS = {
  booking: '#0ea5e9',
  payment: '#10b981',
  maintenance: '#f59e0b',
  system: '#64748b',
  default: '#64748b'
};

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
  default: '#64748b'
};

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'booking',
    title: 'New Booking Request',
    message: 'Sarah Johnson has requested Room A-104 for Spring 2025',
    time: '2 minutes ago',
    read: false,
    priority: 'high',
    studentId: 'ST001',
    actionRequired: true
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Received',
    message: 'Michael Chen has submitted payment for Room B-205',
    time: '1 hour ago',
    read: false,
    priority: 'medium',
    studentId: 'ST002',
    actionRequired: true
  },
  {
    id: 3,
    type: 'maintenance',
    title: 'Maintenance Request',
    message: 'Emma Wilson reported a broken faucet in Room C-301',
    time: '3 hours ago',
    read: true,
    priority: 'high',
    studentId: 'ST003',
    actionRequired: false
  },
  {
    id: 4,
    type: 'system',
    title: 'System Update',
    message: 'Monthly backup completed successfully',
    time: '1 day ago',
    read: true,
    priority: 'low',
    actionRequired: false
  }
];

// Helper functions
const getTypeIcon = (type) => TYPE_ICONS[type] || TYPE_ICONS.default;
const getTypeColor = (type) => TYPE_COLORS[type] || TYPE_COLORS.default;
const getPriorityColor = (priority) => PRIORITY_COLORS[priority] || PRIORITY_COLORS.default;

const filterNotifications = (notifications, activeTab) => {
  switch (activeTab) {
    case TABS.UNREAD:
      return notifications.filter(n => !n.read);
    case TABS.PRIORITY:
      return notifications.filter(n => n.priority === 'high');
    case TABS.ACTIONS:
      return notifications.filter(n => n.actionRequired);
    default:
      return notifications;
  }
};

const getTabCounts = (notifications) => ({
  all: notifications.length,
  unread: notifications.filter(n => !n.read).length,
  priority: notifications.filter(n => n.priority === 'high').length,
  actions: notifications.filter(n => n.actionRequired).length
});

// Components
const NotificationHeader = ({ unreadCount, onMarkAllRead, onClose }) => (
  <div className="notification-header">
    <div className="header-left">
      <h3><i className="fas fa-bell"></i> Notifications</h3>
      {unreadCount > 0 && (
        <span className="unread-badge">{unreadCount}</span>
      )}
    </div>
    <div className="header-actions">
      <button 
        className="mark-all-read-btn"
        onClick={onMarkAllRead}
        disabled={unreadCount === 0}
      >
        <i className="fas fa-check-double"></i> Mark all read
      </button>
      <button onClick={onClose} className="close-btn">
        <i className="fas fa-times"></i>
      </button>
    </div>
  </div>
);

NotificationHeader.propTypes = {
  unreadCount: PropTypes.number.isRequired,
  onMarkAllRead: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

const NotificationTabs = ({ activeTab, onTabChange, counts }) => (
  <div className="notification-tabs">
    <button 
      className={`tab ${activeTab === TABS.ALL ? 'active' : ''}`}
      onClick={() => onTabChange(TABS.ALL)}
    >
      All ({counts.all})
    </button>
    <button 
      className={`tab ${activeTab === TABS.UNREAD ? 'active' : ''}`}
      onClick={() => onTabChange(TABS.UNREAD)}
    >
      Unread ({counts.unread})
    </button>
    <button 
      className={`tab ${activeTab === TABS.PRIORITY ? 'active' : ''}`}
      onClick={() => onTabChange(TABS.PRIORITY)}
    >
      Priority ({counts.priority})
    </button>
    <button 
      className={`tab ${activeTab === TABS.ACTIONS ? 'active' : ''}`}
      onClick={() => onTabChange(TABS.ACTIONS)}
    >
      Actions ({counts.actions})
    </button>
  </div>
);

NotificationTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  counts: PropTypes.object.isRequired
};

const NotificationActions = ({ notification }) => {
  if (!notification.actionRequired) return null;

  return (
    <div className="notification-actions">
      <button className="action-btn primary">
        <i className="fas fa-eye"></i> View Details
      </button>
      {notification.type === 'booking' && (
        <button className="action-btn success">
          <i className="fas fa-check"></i> Approve
        </button>
      )}
      {notification.type === 'maintenance' && (
        <button className="action-btn warning">
          <i className="fas fa-wrench"></i> Assign
        </button>
      )}
    </div>
  );
};

NotificationActions.propTypes = {
  notification: PropTypes.object.isRequired
};

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const handleClick = useCallback(() => {
    onMarkAsRead(notification.id);
  }, [notification.id, onMarkAsRead]);

  const handleMarkRead = useCallback((e) => {
    e.stopPropagation();
    onMarkAsRead(notification.id);
  }, [notification.id, onMarkAsRead]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(notification.id);
  }, [notification.id, onDelete]);

  return (
    <div 
      className={`notification-item ${!notification.read ? 'unread' : ''}`}
      onClick={handleClick}
    >
      <div className="notification-icon" style={{ color: getTypeColor(notification.type) }}>
        <i className={`fas ${getTypeIcon(notification.type)}`}></i>
      </div>
      
      <div className="notification-content">
        <div className="notification-header-row">
          <h5>{notification.title}</h5>
          <div className="notification-meta">
            <span 
              className="priority-indicator"
              style={{ backgroundColor: getPriorityColor(notification.priority) }}
            ></span>
            <span className="time">{notification.time}</span>
          </div>
        </div>
        <p>{notification.message}</p>
        <NotificationActions notification={notification} />
      </div>

      <div className="notification-controls">
        {!notification.read && (
          <button 
            className="mark-read-btn"
            onClick={handleMarkRead}
            title="Mark as read"
          >
            <i className="fas fa-check"></i>
          </button>
        )}
        <button 
          className="delete-btn"
          onClick={handleDelete}
          title="Delete notification"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

const EmptyState = () => (
  <div className="no-notifications">
    <i className="fas fa-bell-slash"></i>
    <h4>No notifications</h4>
    <p>You're all caught up!</p>
  </div>
);

const NotificationCenter = ({ isOpen, onClose, initialNotifications = MOCK_NOTIFICATIONS }) => {
  const [activeTab, setActiveTab] = useState(TABS.ALL);
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  if (!isOpen) return null;

  const filteredNotifications = filterNotifications(notifications, activeTab);
  const counts = getTabCounts(notifications);

  return (
    <div className="notification-center-overlay">
      <div className="notification-center-container">
        <NotificationHeader 
          unreadCount={counts.unread}
          onMarkAllRead={markAllAsRead}
          onClose={onClose}
        />

        <NotificationTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
        />

        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <EmptyState />
          ) : (
            filteredNotifications.map(notif => (
              <NotificationItem 
                key={notif.id}
                notification={notif}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))
          )}
        </div>

        <div className="notification-footer">
          <button className="view-all-btn">
            <i className="fas fa-history"></i> View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

NotificationCenter.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialNotifications: PropTypes.arrayOf(PropTypes.object)
};

export default NotificationCenter;