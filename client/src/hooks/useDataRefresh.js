import { useState, useCallback } from 'react';

const useDataRefresh = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const refresh = useCallback(async (refreshFunction) => {
    setIsRefreshing(true);
    try {
      await refreshFunction();
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Refresh failed:', error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const autoRefresh = useCallback((refreshFunction, interval = 30000) => {
    const intervalId = setInterval(() => {
      if (!isRefreshing) {
        refresh(refreshFunction).catch(console.error);
      }
    }, interval);

    return () => clearInterval(intervalId);
  }, [refresh, isRefreshing]);

  return {
    isRefreshing,
    lastRefresh,
    refresh,
    autoRefresh
  };
};

export default useDataRefresh;