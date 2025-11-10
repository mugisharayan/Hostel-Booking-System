import React, { useState } from 'react';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([
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
  ]);

  const getTypeIcon = (type) => {
    switch(type) {
      case 'booking': return 'fa-calendar-plus';
      case 'payment': return 'fa-credit-card';
      case 'maintenance': return 'fa-wrench';
      case 'system': return 'fa-cog';
      default: return 'fa-bell';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'booking': return '#0ea5e9';
      case 'payment': return '#10b981';
      case 'maintenance': return '#f59e0b';
      case 'system': return '#64748b';
      default: return '#64748b';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'unread') return !notif.read;
    if (activeTab === 'priority') return notif.priority === 'high';
    if (activeTab === 'actions') return notif.actionRequired;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="notification-center-overlay">
      <div className="notification-center-container">
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
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <i className="fas fa-check-double"></i> Mark all read
            </button>
            <button onClick={onClose} className="close-btn">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="notification-tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({notifications.length})
          </button>
          <button 
            className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button 
            className={`tab ${activeTab === 'priority' ? 'active' : ''}`}
            onClick={() => setActiveTab('priority')}
          >
            Priority ({notifications.filter(n => n.priority === 'high').length})
          </button>
          <button 
            className={`tab ${activeTab === 'actions' ? 'active' : ''}`}
            onClick={() => setActiveTab('actions')}
          >
            Actions ({notifications.filter(n => n.actionRequired).length})
          </button>
        </div>

        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="no-notifications">
              <i className="fas fa-bell-slash"></i>
              <h4>No notifications</h4>
              <p>You're all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map(notif => (
              <div 
                key={notif.id} 
                className={`notification-item ${!notif.read ? 'unread' : ''}`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="notification-icon" style={{ color: getTypeColor(notif.type) }}>
                  <i className={`fas ${getTypeIcon(notif.type)}`}></i>
                </div>
                
                <div className="notification-content">
                  <div className="notification-header-row">
                    <h5>{notif.title}</h5>
                    <div className="notification-meta">
                      <span 
                        className="priority-indicator"
                        style={{ backgroundColor: getPriorityColor(notif.priority) }}
                      ></span>
                      <span className="time">{notif.time}</span>
                    </div>
                  </div>
                  <p>{notif.message}</p>
                  
                  {notif.actionRequired && (
                    <div className="notification-actions">
                      <button className="action-btn primary">
                        <i className="fas fa-eye"></i> View Details
                      </button>
                      {notif.type === 'booking' && (
                        <button className="action-btn success">
                          <i className="fas fa-check"></i> Approve
                        </button>
                      )}
                      {notif.type === 'maintenance' && (
                        <button className="action-btn warning">
                          <i className="fas fa-wrench"></i> Assign
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="notification-controls">
                  {!notif.read && (
                    <button 
                      className="mark-read-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notif.id);
                      }}
                      title="Mark as read"
                    >
                      <i className="fas fa-check"></i>
                    </button>
                  )}
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    title="Delete notification"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
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

export default NotificationCenter;