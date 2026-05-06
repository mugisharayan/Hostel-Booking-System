import apiService from './api.service.js';

const custodianService = {
  // Create new hostel
  createHostel: async (hostelData) => {
    try {
      const response = await apiService.custodian.createHostel(hostelData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create hostel');
    }
  },

  // Get my hostel
  getMyHostel: async () => {
    try {
      const response = await apiService.custodian.getMyHostel();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch hostel');
    }
  },

  // Update hostel
  updateHostel: async (hostelData) => {
    try {
      const response = await apiService.custodian.updateHostel(hostelData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update hostel');
    }
  },

  // Get custodian dashboard data
  getDashboardData: async () => {
    try {
      const response = await apiService.custodian.getDashboardData();
      return response.data.data; // Return the nested data object
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  },

  // Get custodian bookings
  getBookings: async () => {
    try {
      const response = await apiService.custodian.getBookings();
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },

  // Get custodian payments
  getPayments: async () => {
    try {
      const response = await apiService.custodian.getPayments();
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payments');
    }
  },

  // Get custodian rooms
  getRooms: async () => {
    try {
      const response = await apiService.custodian.getRooms();
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rooms');
    }
  },

  // Create room
  createRoom: async (roomData) => {
    try {
      const response = await apiService.custodian.createRoom(roomData);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create room');
    }
  },

  // Update room
  updateRoom: async (roomId, roomData) => {
    try {
      const response = await apiService.custodian.updateRoom(roomId, roomData);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update room');
    }
  },

  // Delete room
  deleteRoom: async (roomId) => {
    try {
      const response = await apiService.custodian.deleteRoom(roomId);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete room');
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
  },

  // Seed sample rooms
  seedRooms: async () => {
    try {
      const response = await apiService.custodian.seedRooms();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to seed rooms');
    }
  },

  // Get pending assignments
  getPendingAssignments: async () => {
    try {
      const response = await apiService.custodian.getPendingAssignments();
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pending assignments');
    }
  },

  // Assign room to student
  assignRoom: async (paymentId, roomId) => {
    try {
      const response = await apiService.custodian.assignRoom(paymentId, roomId);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to assign room');
    }
  },

  // Get assignment history
  getAssignmentHistory: async () => {
    try {
      const response = await apiService.custodian.getAssignmentHistory();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assignment history');
    }
  },

  // Get maintenance requests
  getMaintenanceRequests: async () => {
    try {
      const response = await apiService.custodian.getMaintenanceRequests();
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch maintenance requests');
    }
  },

  // Update maintenance request status
  updateMaintenanceStatus: async (requestId, status) => {
    try {
      const response = await apiService.custodian.updateMaintenanceStatus(requestId, status);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update maintenance status');
    }
  },

  // Get custodian notifications
  getNotifications: async () => {
    try {
      const response = await apiService.custodian.getNotifications();
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
};

export default custodianService;