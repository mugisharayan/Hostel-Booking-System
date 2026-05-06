import axios from 'axios';
import { logger } from '../utils/logger';
import { handleError } from '../utils/errorHandler';

const trimTrailingSlash = (value) => value?.replace(/\/+$/, '');

export const API_BASE_URL =
  trimTrailingSlash(import.meta.env.VITE_API_URL) ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add auth token to requests
axios.interceptors.request.use((config) => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    try {
      const userData = JSON.parse(auth);
      if (userData.token && userData.token !== 'undefined' && userData.token !== 'null') {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    } catch (error) {
      logger.error('Invalid auth data in localStorage', error);
      localStorage.removeItem('auth');
    }
  }
  return config;
});

// Response interceptor for error handling
let isRedirecting = false;
axios.interceptors.response.use(
  (response) => {
    // Handle new API response format
    if (response.data?.status === 'success') {
      return {
        ...response,
        data: response.data.data || response.data
      };
    }
    return response;
  },
  (error) => {
    const { message } = handleError(error, 'API request failed');
    
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      logger.warn('401 Unauthorized - clearing auth and redirecting');
      localStorage.removeItem('auth');
      window.location.replace('/');
    }
    
    // Return a more user-friendly error
    return Promise.reject({
      ...error,
      message: message
    });
  }
);

const apiService = {
  // Auth endpoints
  auth: {
    login: (email, password) => 
      axios.post(`${API_BASE_URL}/users/login`, { email, password }),
    
    register: (userData) => 
      axios.post(`${API_BASE_URL}/users/register`, userData),
    
    logout: () => 
      axios.post(`${API_BASE_URL}/users/logout`)
  },

  // User endpoints
  users: {
    getProfile: () => 
      axios.get(`${API_BASE_URL}/users/profile`),
    
    updateProfile: (userData) => 
      axios.put(`${API_BASE_URL}/users/profile`, userData),
    
    changePassword: (passwordData) => 
      axios.put(`${API_BASE_URL}/users/change-password`, passwordData)
  },

  // Hostel endpoints
  hostels: {
    getAll: () => 
      axios.get(`${API_BASE_URL}/hostels`),
    
    getById: (id) => 
      axios.get(`${API_BASE_URL}/hostels/${id}`),
    
    create: (hostelData) => 
      axios.post(`${API_BASE_URL}/hostels`, hostelData),
    
    update: (id, hostelData) => 
      axios.put(`${API_BASE_URL}/hostels/${id}`, hostelData),
    
    delete: (id) => 
      axios.delete(`${API_BASE_URL}/hostels/${id}`)
  },

  // Booking endpoints
  bookings: {
    getAll: () => 
      axios.get(`${API_BASE_URL}/bookings/my-bookings`),
    
    getById: (id) => 
      axios.get(`${API_BASE_URL}/bookings/${id}`),
    
    create: (bookingData) => 
      axios.post(`${API_BASE_URL}/bookings`, bookingData),
    
    update: (id, bookingData) => 
      axios.put(`${API_BASE_URL}/bookings/${id}`, bookingData),
    
    cancel: (id, reason) => 
      axios.put(`${API_BASE_URL}/bookings/${id}/cancel`, { reason })
  },

  // Payment endpoints
  payments: {
    getAll: () => 
      axios.get(`${API_BASE_URL}/payments`),
    
    create: (paymentData) => 
      axios.post(`${API_BASE_URL}/payments/booking/${paymentData.bookingId}`, paymentData),
    
    getByTransaction: (transactionId) => 
      axios.get(`${API_BASE_URL}/payments/transaction/${transactionId}`),
    
    update: (id, paymentData) => 
      axios.put(`${API_BASE_URL}/payments/${id}`, paymentData)
  },

  // Maintenance endpoints
  maintenance: {
    getAll: () => 
      axios.get(`${API_BASE_URL}/maintenance`),
    
    getMyRequests: () => 
      axios.get(`${API_BASE_URL}/maintenance/my-requests`),
    
    create: (requestData) => 
      axios.post(`${API_BASE_URL}/maintenance`, requestData),
    
    update: (id, requestData) => 
      axios.put(`${API_BASE_URL}/maintenance/${id}`, requestData)
  },

  // Communication endpoints
  communication: {
    sendMessage: (messageData) => 
      axios.post(`${API_BASE_URL}/communication/messages`, messageData),
    
    getMessages: () => 
      axios.get(`${API_BASE_URL}/communication/messages`),
    
    createPaymentInquiry: (inquiryData) => 
      axios.post(`${API_BASE_URL}/communication/payment-inquiry`, inquiryData),
    
    createRoomRequest: (requestData) => 
      axios.post(`${API_BASE_URL}/communication/room-request`, requestData),
    
    createSupportTicket: (ticketData) => 
      axios.post(`${API_BASE_URL}/communication/support-ticket`, ticketData),
    
    createEmergencyContact: (emergencyData) => 
      axios.post(`${API_BASE_URL}/communication/emergency`, emergencyData)
  },

  // Dashboard endpoints
  dashboard: {
    getStats: () => 
      axios.get(`${API_BASE_URL}/dashboard/stats`),
    
    getRecentActivity: () => 
      axios.get(`${API_BASE_URL}/dashboard/activity`)
  },

  // Room endpoints
  rooms: {
    getAll: () => 
      axios.get(`${API_BASE_URL}/rooms`),
    
    getByHostel: (hostelId) => 
      axios.get(`${API_BASE_URL}/rooms/hostel/${hostelId}`),
    
    create: (roomData) => 
      axios.post(`${API_BASE_URL}/rooms`, roomData),
    
    update: (id, roomData) => 
      axios.put(`${API_BASE_URL}/rooms/${id}`, roomData),
    
    delete: (id) => 
      axios.delete(`${API_BASE_URL}/rooms/${id}`)
  },

  // Notification endpoints
  notifications: {
    getAll: () => 
      axios.get(`${API_BASE_URL}/notifications`),
    
    markAsRead: (notificationId) => 
      axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`),
    
    getUnreadCount: () => 
      axios.get(`${API_BASE_URL}/notifications/unread-count`)
  },

  // Message endpoints
  messages: {
    getAll: () => 
      axios.get(`${API_BASE_URL}/messages`),
    
    send: (hostelId, content) => 
      axios.post(`${API_BASE_URL}/messages`, { hostelId, content }),
    
    markAsRead: () => 
      axios.put(`${API_BASE_URL}/messages/mark-read`)
  },

  // Custodian endpoints
  custodian: {
    createHostel: (hostelData) => 
      axios.post(`${API_BASE_URL}/custodian/create-hostel`, hostelData),
    
    getMyHostel: () => 
      axios.get(`${API_BASE_URL}/custodian/my-hostel`),
    
    updateHostel: (hostelData) => 
      axios.put(`${API_BASE_URL}/custodian/update-hostel`, hostelData),
    
    getDashboardData: () => 
      axios.get(`${API_BASE_URL}/custodian/dashboard-data`),
    
    getBookings: () => 
      axios.get(`${API_BASE_URL}/custodian/bookings`),
    
    getPayments: () => 
      axios.get(`${API_BASE_URL}/custodian/payments`),
    
    getRooms: () => 
      axios.get(`${API_BASE_URL}/custodian/rooms`),
    
    createRoom: (roomData) => 
      axios.post(`${API_BASE_URL}/custodian/rooms`, roomData),
    
    updateRoom: (roomId, roomData) => 
      axios.put(`${API_BASE_URL}/custodian/rooms/${roomId}`, roomData),
    
    deleteRoom: (roomId) => 
      axios.delete(`${API_BASE_URL}/custodian/rooms/${roomId}`),
    
    getProfile: () => 
      axios.get(`${API_BASE_URL}/custodian/profile`),
    
    updateProfile: (profileData) => 
      axios.put(`${API_BASE_URL}/custodian/profile`, profileData),
    
    changePassword: (passwordData) => 
      axios.put(`${API_BASE_URL}/custodian/change-password`, passwordData),
    
    getPendingPayments: () => 
      axios.get(`${API_BASE_URL}/custodian/payments/pending`),
    
    approvePayment: (paymentId) => 
      axios.put(`${API_BASE_URL}/custodian/payments/${paymentId}/approve`),
    
    rejectPayment: (paymentId) => 
      axios.put(`${API_BASE_URL}/custodian/payments/${paymentId}/reject`),
    
    seedRooms: () => 
      axios.post(`${API_BASE_URL}/custodian/seed-rooms`),
    
    getPendingAssignments: () => 
      axios.get(`${API_BASE_URL}/custodian/pending-assignments`),
    
    assignRoom: (paymentId, roomId) => 
      axios.put(`${API_BASE_URL}/custodian/assign-room/${paymentId}`, { roomId }),
    
    getAssignmentHistory: () => 
      axios.get(`${API_BASE_URL}/custodian/assignment-history`),
    
    getMaintenanceRequests: () => 
      axios.get(`${API_BASE_URL}/custodian/maintenance-requests`),
    
    updateMaintenanceStatus: (requestId, status) => 
      axios.put(`${API_BASE_URL}/custodian/maintenance-requests/${requestId}`, { status }),
    
    getMessages: () => 
      axios.get(`${API_BASE_URL}/custodian/messages`),
    
    sendMessage: (recipientId, content) => 
      axios.post(`${API_BASE_URL}/custodian/messages`, { recipientId, content }),
    
    markMessagesRead: () => 
      axios.put(`${API_BASE_URL}/custodian/messages/mark-read`),
    
    getNotifications: () => 
      axios.get(`${API_BASE_URL}/custodian/notifications`)
  }
};

export default apiService;
export { apiService };
