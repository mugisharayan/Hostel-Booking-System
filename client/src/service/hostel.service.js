import apiService from './api.service.js';

const hostelService = {
  // Get all hostels
  getAllHostels: async () => {
    try {
      const response = await apiService.hostels.getAll();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch hostels');
    }
  },

  // Find hostel by name
  findHostelByName: async (hostelName) => {
    try {
      const hostels = await hostelService.getAllHostels();
      return hostels.find(hostel => 
        hostel.name.toLowerCase() === hostelName.toLowerCase()
      );
    } catch (error) {
      throw new Error('Failed to find hostel');
    }
  },

  // Find room by name within a hostel
  findRoomByName: async (hostelId, roomName) => {
    try {
      const response = await apiService.hostels.getById(hostelId);
      const hostel = response.data;
      
      // Assuming rooms are stored in hostel document
      return hostel.rooms?.find(room => 
        room.name.toLowerCase() === roomName.toLowerCase()
      );
    } catch (error) {
      throw new Error('Failed to find room');
    }
  },

  // Get room price from hostel data
  getRoomPrice: (hostelName, roomName) => {
    // This is a fallback for when we can't get from API
    // In real implementation, this would come from database
    const roomPrices = {
      'Single Room': 400000,
      'Double Room': 300000,
      'Triple Room': 250000,
      'Quad Room': 200000
    };
    
    return roomPrices[roomName] || 300000;
  }
};

export default hostelService;