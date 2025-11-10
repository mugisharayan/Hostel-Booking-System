import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add auth token to requests
axios.interceptors.request.use((config) => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    const userData = JSON.parse(auth);
    if (userData.token) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth');
      window.location.href = '/';
    }
    return Promise.reject(error);
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

  // Custodian endpoints
  custodian: {
    linkHostel: (hostelName) => 
      axios.post(`${API_BASE_URL}/custodian/link-hostel`, { hostelName }),
    
    getDashboardData: () => 
      axios.get(`${API_BASE_URL}/custodian/dashboard-data`),
    
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
      axios.put(`${API_BASE_URL}/custodian/payments/${paymentId}/reject`)
  }
};

export default apiService;
export { apiService };