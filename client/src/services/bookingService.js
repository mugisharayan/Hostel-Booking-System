import api from '../services/api';

export const getBookingDetails = async (bookingId) => {
  // The 'api' instance automatically adds the base URL and auth token.
  const response = await api.get(`/bookings/${bookingId}`);
  return response.data; // Return the full data object
};