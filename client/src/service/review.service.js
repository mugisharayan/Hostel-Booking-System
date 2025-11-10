import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    const userData = JSON.parse(auth);
    return userData.token;
  }
  return null;
};

const reviewService = {
  createReview: async (reviewData) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${API_BASE_URL}/reviews`, reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create review');
    }
  },

  getHostelReviews: async (hostelId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/hostel/${hostelId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  },

  getMyReviews: async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/reviews/my-reviews`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch your reviews');
    }
  }
};

export default reviewService;
