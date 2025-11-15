import apiService from './api.service.js';
import {
  createServiceMethod,
  validateRequired,
  SERVICE_CONTEXTS
} from '../utils/service.utils.js';

// Booking validation utilities
const validateBookingData = (bookingData) => {
  const requiredFields = ['hostel', 'room', 'startDate', 'endDate'];
  validateRequired(bookingData, requiredFields);
  
  const startDate = new Date(bookingData.startDate);
  const endDate = new Date(bookingData.endDate);
  const now = new Date();
  
  if (startDate < now) {
    throw new Error('Start date cannot be in the past');
  }
  
  if (endDate <= startDate) {
    throw new Error('End date must be after start date');
  }
};

const validateBookingId = (bookingId) => {
  if (!bookingId) {
    throw new Error('Booking ID is required');
  }
};

// Booking status utilities
const isActiveBooking = (booking) => {
  const endDate = new Date(booking.endDate);
  const now = new Date();
  return endDate > now && booking.status !== 'cancelled';
};

const filterActiveBookings = (bookings) => {
  return bookings.filter(isActiveBooking);
};

const sortBookingsByDate = (bookings, ascending = false) => {
  return bookings.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

const bookingService = {
  // Create a new booking
  createBooking: createServiceMethod(async (bookingData) => {
    validateBookingData(bookingData);
    const response = await apiService.bookings.create(bookingData);
    return response.data;
  }, SERVICE_CONTEXTS.BOOKING),

  // Get user's bookings
  getMyBookings: createServiceMethod(async () => {
    const response = await apiService.bookings.getAll();
    const bookings = response.data;
    return sortBookingsByDate(bookings);
  }, SERVICE_CONTEXTS.BOOKING),

  // Cancel a booking
  cancelBooking: createServiceMethod(async (bookingId, reason = '') => {
    validateBookingId(bookingId);
    const response = await apiService.bookings.cancel(bookingId, reason);
    return response.data;
  }, SERVICE_CONTEXTS.BOOKING),

  // Check for active bookings
  checkActiveBookings: createServiceMethod(async () => {
    const response = await apiService.bookings.getAll();
    const bookings = response.data;
    return filterActiveBookings(bookings);
  }, SERVICE_CONTEXTS.BOOKING),

  // Get booking by ID
  getBookingById: createServiceMethod(async (bookingId) => {
    validateBookingId(bookingId);
    const response = await apiService.bookings.getById(bookingId);
    return response.data;
  }, SERVICE_CONTEXTS.BOOKING),

  // Check if user has active bookings
  hasActiveBookings: createServiceMethod(async () => {
    const activeBookings = await bookingService.checkActiveBookings();
    return activeBookings.length > 0;
  }, SERVICE_CONTEXTS.BOOKING),

  // Get booking statistics
  getBookingStats: createServiceMethod(async () => {
    const bookings = await bookingService.getMyBookings();
    const active = filterActiveBookings(bookings);
    const cancelled = bookings.filter(b => b.status === 'cancelled');
    const completed = bookings.filter(b => b.status === 'completed');
    
    return {
      total: bookings.length,
      active: active.length,
      cancelled: cancelled.length,
      completed: completed.length
    };
  }, SERVICE_CONTEXTS.BOOKING)
};

export default bookingService;