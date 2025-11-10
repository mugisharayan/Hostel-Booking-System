import apiService from './api.service.js';

const userService = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await apiService.users.getProfile();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  },
  
  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      const response = await apiService.users.updateProfile(profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },
  
  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await apiService.users.changePassword(passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },
  
  // Save booking profile data
  saveBookingProfile: async (bookingData) => {
    const profileData = {
      phone: bookingData.phone,
      gender: bookingData.gender,
      dateOfBirth: bookingData.dob,
      yearOfStudy: bookingData.yearOfStudy,
      studentNumber: bookingData.studentNumber,
      residence: bookingData.residence,
      nextOfKinName: bookingData.nextOfKinName,
      nextOfKinContact: bookingData.nextOfKinContact,
      guardianName: bookingData.guardianName,
      guardianContact: bookingData.guardianContact,
      profileCompleted: true
    };
    
    try {
      const response = await apiService.users.updateProfile(profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to save profile');
    }
  }
};

export default userService;