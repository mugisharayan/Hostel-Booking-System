import apiService from './api.service.js';

const bookingService = {
  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      const response = await apiService.bookings.create(bookingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  },

  // Get user's bookings
  getMyBookings: async () => {
    try {
      const response = await apiService.bookings.getAll();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },

  // Cancel a booking
  cancelBooking: async (bookingId, reason) => {
    try {
      const response = await apiService.bookings.cancel(bookingId, reason);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel booking');
    }
  },

  // Check for active bookings
  checkActiveBookings: async () => {
    try {
      // Force fresh data by bypassing any potential cache
      const response = await apiService.bookings.getAll();
      const bookings = response.data;
      const activeBookings = bookings.filter(booking => {
        const endDate = new Date(booking.endDate);
        const now = new Date();
        return endDate > now && booking.status !== 'cancelled';
      });
      return activeBookings;
    } catch (error) {
      throw new Error('Failed to check active bookings');
    }
  }
};

export default bookingService;