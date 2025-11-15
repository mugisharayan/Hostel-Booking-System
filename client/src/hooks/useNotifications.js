import { useState, useEffect, useCallback } from 'react';
import custodianService from '../service/custodian.service';

const DEFAULT_POLLING_INTERVAL = 30000;

export const useNotifications = (pollingInterval = DEFAULT_POLLING_INTERVAL) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      const notifications = await custodianService.getNotifications();
      const newCount = notifications.length;
      
      setUnreadCount(newCount);
      return newCount;
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setHasError(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, pollingInterval);
    return () => clearInterval(interval);
  }, [loadNotifications, pollingInterval]);

  return {
    unreadCount,
    isLoading,
    hasError,
    refetch: loadNotifications
  };
};