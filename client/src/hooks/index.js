// Export all custom hooks for easy importing

// API and data fetching hooks
export { useApi, usePaginatedApi } from './useApi';
export { useNotifications } from './useNotifications';

// Storage hooks
export { 
  useLocalStorage, 
  useSessionStorage, 
  useMultipleLocalStorage 
} from './useLocalStorage';

// Performance hooks
export { 
  useDebounce, 
  useDebouncedCallback, 
  useDebouncedSearch, 
  useThrottle 
} from './useDebounce';

// UI and responsive hooks
export { 
  useWindowSize, 
  useBreakpoint, 
  useMediaQuery, 
  useScrollPosition, 
  useScrollDirection 
} from './useWindowSize';

// Form and authentication hooks
export { useAuthModal } from './useAuthModal';

// Utility hooks
export { useIntersectionObserver } from './useIntersectionObserver';
export { useLazyLoading } from './useLazyLoading';
export { useDataRefresh } from './useDataRefresh';
export { useRealTimeUpdate } from './useRealTimeUpdate';
export { useWebSocket } from './useWebSocket';

// Re-export commonly used React hooks with custom utilities
export { useState, useEffect, useCallback, useMemo, useRef } from 'react';