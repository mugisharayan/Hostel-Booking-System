import React, { useState, useEffect } from 'react';
import custodianService from '../../service/custodian.service';

const CustodianNotificationBell = ({ onClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const notifications = await custodianService.getNotifications();
      setUnreadCount(notifications.length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  return (
    <button className="icon-btn notification-bell" onClick={onClick} title="Notifications">
      <i className="fa-solid fa-bell"></i>
      {unreadCount > 0 && (
        <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
      )}
    </button>
  );
};

export default CustodianNotificationBell;