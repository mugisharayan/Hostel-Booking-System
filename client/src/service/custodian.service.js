import apiService from './api.service.js';

const custodianService = {
  // Link custodian to existing hostel
  linkToHostel: async (hostelName) => {
    try {
      const response = await apiService.custodian.linkHostel(hostelName);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to link to hostel');
    }
  },

  // Get custodian dashboard data
  getDashboardData: async () => {
    try {
      const response = await apiService.custodian.getDashboardData();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  },

  // Get custodian profile
  getProfile: async () => {
    try {
      const response = await apiService.custodian.getProfile();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  // Update custodian profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiService.custodian.updateProfile(profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await apiService.custodian.changePassword(passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }
};

export default custodianService;