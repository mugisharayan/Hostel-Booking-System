// Auth utility functions for client-side

export const AUTH_STORAGE_KEY = 'auth';
export const USER_STORAGE_KEY = 'user';

// Local storage utilities
export const getStoredAuth = () => {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    return authData ? JSON.parse(authData) : null;
  } catch (error) {
    console.error('Invalid auth data in localStorage:', error);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const setStoredAuth = (userData) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

// Auth validation
export const isValidAuthData = (authData) => {
  return authData && authData.token && authData._id;
};

// Error handling
export const handleAuthError = (error, context = '') => {
  console.error(`Auth error${context ? ` in ${context}` : ''}:`, error);
  
  // If it's a token-related error, clear stored auth
  if (error.message?.includes('token') || error.status === 401) {
    clearStoredAuth();
  }
  
  return error;
};

// Data loading utilities
export const loadUserDataSafely = async (loadFn, fallback = []) => {
  try {
    return await loadFn();
  } catch (error) {
    console.error('Failed to load user data:', error);
    return fallback;
  }
};