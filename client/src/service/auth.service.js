import apiService from './api.service';

/**
 * Logs in a user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<any>}
 */
const login = async (email, password) => {
  const response = await apiService.auth.login(email, password);
  const user = response.data;
  
  if (user.token) {
    localStorage.setItem('auth', JSON.stringify(user));
  }
  return user;
};

/**
 * Logs out the current user.
 */
const logout = async () => {
  try {
    await apiService.auth.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('auth');
  }
};

/**
 * Gets the current user from localStorage.
 * @returns {any | null}
 */
const getCurrentUser = () => {
  const userStr = localStorage.getItem('auth');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Registers a new user.
 * @param {object} userData
 * @returns {Promise<any>}
 */
const register = async (userData) => {
  const response = await apiService.auth.register(userData);
  return response.data;
};

const authService = {
  login,
  logout,
  getCurrentUser,
  register,
};

export default authService;