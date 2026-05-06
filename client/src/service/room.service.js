import apiService from './api.service.js';

const roomService = {
  // Get all rooms
  getRooms: async () => {
    try {
      const response = await apiService.rooms.getAll();
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rooms');
    }
  },

  // Create new room
  createRoom: async (roomData) => {
    try {
      const response = await apiService.rooms.create(roomData);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create room');
    }
  },

  // Update room
  updateRoom: async (roomId, roomData) => {
    try {
      const response = await apiService.rooms.update(roomId, roomData);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update room');
    }
  },

  // Delete room
  deleteRoom: async (roomId) => {
    try {
      const response = await apiService.rooms.delete(roomId);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete room');
    }
  },

  // Get room statistics
  getRoomStats: async () => {
    try {
      const response = await apiService.get('/rooms/stats');
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch room stats');
    }
  }
};

export default roomService;