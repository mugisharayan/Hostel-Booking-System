import { useState, useEffect, useCallback } from 'react';

export const useLazyLoading = (fetchFunction, initialPage = 1, pageSize = 20) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [error, setError] = useState(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const newData = await fetchFunction(page, pageSize);
      
      if (newData.length < pageSize) {
        setHasMore(false);
      }

      setData(prevData => [...prevData, ...newData]);
      setPage(prevPage => prevPage + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, page, pageSize, loading, hasMore]);

  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
  }, [initialPage]);

  useEffect(() => {
    loadMore();
  }, []);

  return {
    data,
    loading,
    hasMore,
    error,
    loadMore,
    reset
  };
};

export const useInfiniteScroll = (callback, hasMore, loading) => {
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 5) {
        callback();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, hasMore, loading]);
};

export const useOfflineStorage = (key) => {
  const [data, setData] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  });

  const saveData = useCallback((newData) => {
    try {
      localStorage.setItem(key, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [key]);

  const clearData = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setData(null);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, [key]);

  return [data, saveData, clearData];
};