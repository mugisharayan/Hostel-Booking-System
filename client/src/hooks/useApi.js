import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for API calls with loading, error, and caching
 * @param {Function} apiCall - The API function to call
 * @param {Object} options - Configuration options
 */
export const useApi = (apiCall, options = {}) => {
  const {
    immediate = true,
    dependencies = [],
    cacheKey = null,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  
  const retryCountRef = useRef(0);
  const cacheRef = useRef(new Map());

  // Check cache
  const getCachedData = useCallback((key) => {
    if (!key) return null;
    
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.data;
    }
    
    return null;
  }, [cacheTime]);

  // Set cache
  const setCachedData = useCallback((key, data) => {
    if (!key) return;
    
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now()
    });
  }, []);

  // Execute API call
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (cacheKey) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return cachedData;
        }
      }

      const result = await apiCall(...args);
      
      setData(result);
      setLastFetch(Date.now());
      retryCountRef.current = 0;

      // Cache the result
      if (cacheKey) {
        setCachedData(cacheKey, result);
      }

      return result;
    } catch (err) {
      console.error('API call failed:', err);
      
      // Retry logic
      if (retryCountRef.current < retryAttempts) {
        retryCountRef.current++;
        setTimeout(() => execute(...args), retryDelay * retryCountRef.current);
        return;
      }
      
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, cacheKey, getCachedData, setCachedData, retryAttempts, retryDelay]);

  // Refresh data
  const refresh = useCallback(() => {
    if (cacheKey) {
      cacheRef.current.delete(cacheKey);
    }
    return execute();
  }, [execute, cacheKey]);

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  // Auto-execute on mount and dependency changes
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute, ...dependencies]);

  return {
    data,
    loading,
    error,
    execute,
    refresh,
    clearCache,
    lastFetch
  };
};

/**
 * Hook for paginated API calls
 */
export const usePaginatedApi = (apiCall, options = {}) => {
  const { pageSize = 10, ...apiOptions } = options;
  
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
  const { data, loading, error, execute } = useApi(
    (...args) => apiCall({ page, limit: pageSize, ...args[0] }),
    { ...apiOptions, immediate: false }
  );

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setAllData(data.items || data);
      } else {
        setAllData(prev => [...prev, ...(data.items || data)]);
      }
      
      setHasMore((data.items || data).length === pageSize);
    }
  }, [data, page, pageSize]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  const reset = useCallback(() => {
    setPage(1);
    setAllData([]);
    setHasMore(true);
  }, []);

  useEffect(() => {
    execute();
  }, [page, execute]);

  return {
    data: allData,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
    page
  };
};