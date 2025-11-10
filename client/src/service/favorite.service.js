import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthToken = () => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    const userData = JSON.parse(auth);
    return userData.token;
  }
  return null;
};

const favoriteService = {
  getMyFavorites: async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch favorites');
    }
  },

  addFavorite: async (hostelId) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${API_BASE_URL}/favorites/${hostelId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add favorite');
    }
  },

  removeFavorite: async (hostelId) => {
    try {
      const token = getAuthToken();
      const response = await axios.delete(`${API_BASE_URL}/favorites/${hostelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove favorite');
    }
  }
};

export default favoriteService;
