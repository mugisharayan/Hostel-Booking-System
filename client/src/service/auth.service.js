import apiService from './api.service';
import {
  createServiceMethod,
  validateRequired,
  validateEmail,
  SERVICE_CONTEXTS
} from '../utils/service.utils.js';
import {
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
  isValidAuthData
} from '../utils/auth.utils.js';

/**
 * Validates login credentials
 * @param {string} email 
 * @param {string} password 
 */
const validateLoginData = (email, password) => {
  validateRequired({ email, password }, ['email', 'password']);
  validateEmail(email);
};

/**
 * Validates registration data
 * @param {object} userData 
 */
const validateRegistrationData = (userData) => {
  const requiredFields = ['name', 'email', 'role'];
  validateRequired(userData, requiredFields);
  validateEmail(userData.email);
};

/**
 * Logs in a user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<any>}
 */
const login = createServiceMethod(async (email, password) => {
  validateLoginData(email, password);
  
  const response = await apiService.auth.login(email, password);
  const user = response.data;
  
  if (user && user.token) {
    setStoredAuth(user);
    return user;
  }
  
  throw new Error('Invalid login response');
}, SERVICE_CONTEXTS.AUTH);

/**
 * Logs out the current user.
 */
const logout = async () => {
  try {
    await apiService.auth.logout();
  } catch (error) {
    console.warn('Logout API call failed:', error.message);
  } finally {
    clearStoredAuth();
  }
};

/**
 * Gets the current user from localStorage.
 * @returns {any | null}
 */
const getCurrentUser = () => {
  const authData = getStoredAuth();
  return isValidAuthData(authData) ? authData : null;
};

/**
 * Registers a new user.
 * @param {object} userData
 * @returns {Promise<any>}
 */
const register = createServiceMethod(async (userData) => {
  validateRegistrationData(userData);
  
  const response = await apiService.auth.register(userData);
  const user = response.data;
  
  if (user && user.token) {
    setStoredAuth(user);
  }
  
  return user;
}, SERVICE_CONTEXTS.AUTH);

/**
 * Checks if user is currently authenticated
 * @returns {boolean}
 */
const isAuthenticated = () => {
  const user = getCurrentUser();
  return !!user && !!user.token;
};

/**
 * Gets the current user's token
 * @returns {string | null}
 */
const getToken = () => {
  const user = getCurrentUser();
  return user?.token || null;
};

const authService = {
  login,
  logout,
  getCurrentUser,
  register,
  isAuthenticated,
  getToken,
};

export default authService;