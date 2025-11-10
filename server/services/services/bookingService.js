import api from '../api';

export const createBooking = async (hostelId, bookingDetails) => {
  const response = await api.post('/bookings', { hostelId, ...bookingDetails });
  return response.data;
};

export const getBookingDetails = async (bookingId) => {
  // The 'api' instance automatically adds the base URL and auth token.
  const response = await api.get(`/bookings/${bookingId}`);
  return response.data; // Return the full data object
};