import React, { useState, useEffect, useCallback } from 'react';
import custodianService from '../../service/custodian.service';
import './CustodianNotificationBell.css';

const CustodianNotificationBell = ({ onClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const notifications = await custodianService.getNotifications();
      const newCount = notifications.length;
      
      // Trigger animation if count increased
      if (newCount > unreadCount) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
      }
      
      setUnreadCount(newCount);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [unreadCount]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button 
      className={`icon-btn notification-bell ${
        isAnimating ? 'animate-bell' : ''
      } ${
        hasError ? 'error' : ''
      }`}
      onClick={handleClick}
      title={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ', no unread notifications'}`}
      disabled={isLoading}
    >
      <i className={`fa-solid fa-bell ${isLoading ? 'fa-spin' : ''}`}></i>
      {unreadCount > 0 && (
        <span 
          className="notification-badge"
          aria-hidden="true"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
      {hasError && (
        <span className="error-indicator" title="Failed to load notifications">
          <i className="fa-solid fa-exclamation-triangle"></i>
        </span>
      )}
    </button>
  );
};

export default CustodianNotificationBell;