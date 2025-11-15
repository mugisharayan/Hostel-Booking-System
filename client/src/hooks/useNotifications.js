import { useState, useEffect, useCallback, useRef } from 'react';
import custodianService from '../service/custodian.service';

// Constants
const DEFAULT_POLLING_INTERVAL = 30000;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 5000;

export const useNotifications = (options = {}) => {
  const {
    pollingInterval = DEFAULT_POLLING_INTERVAL,
    enablePolling = true,
    onCountChange = null,
    onError = null
  } = options;

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  
  const retryCountRef = useRef(0);
  const intervalRef = useRef(null);
  const previousCountRef = useRef(0);

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      const notificationData = await custodianService.getNotifications();
      const newCount = notificationData.length;
      
      setNotifications(notificationData);
      setUnreadCount(newCount);
      setLastFetch(Date.now());
      retryCountRef.current = 0;
      
      // Trigger callback if count changed
      if (onCountChange && newCount !== previousCountRef.current) {
        onCountChange(newCount, previousCountRef.current);
      }
      previousCountRef.current = newCount;
      
      return notificationData;
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setHasError(true);
      
      // Retry logic
      if (retryCountRef.current < MAX_RETRY_ATTEMPTS) {
        retryCountRef.current++;
        setTimeout(() => {
          loadNotifications();
        }, RETRY_DELAY * retryCountRef.current);
      } else if (onError) {
        onError(error);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [onCountChange, onError]);

  // Start/stop polling
  const startPolling = useCallback(() => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(loadNotifications, pollingInterval);
  }, [loadNotifications, pollingInterval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Initial load and polling setup
  useEffect(() => {
    loadNotifications();
    
    if (enablePolling) {
      startPolling();
    }
    
    return () => {
      stopPolling();
    };
  }, [loadNotifications, enablePolling, startPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    unreadCount,
    notifications,
    isLoading,
    hasError,
    lastFetch,
    refetch: loadNotifications,
    startPolling,
    stopPolling,
    markAsRead,
    markAllAsRead,
    clearAll
  };
};