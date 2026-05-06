import React, { useState, useEffect } from 'react';
import apiService from '../../service/api.service';

const NotificationBell = ({ onClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const response = await apiService.notifications.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  return (
    <div className="notification-bell" onClick={onClick}>
      <i className="fas fa-bell"></i>
      {unreadCount > 0 && (
        <span className="notification-badge">{unreadCount}</span>
      )}
    </div>
  );
};

export default NotificationBell;