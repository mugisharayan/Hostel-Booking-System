const axios = require('axios');

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

const createPayment = (paymentData) => API.post('/payments', paymentData);
const fetchPaymentStatus = (id) => API.get(`/payments/${id}`);
const fetchBookingDetails = (bookingId) => API.get(`/bookings/${bookingId}`);

module.exports = {
  createPayment,
  fetchPaymentStatus,
  fetchBookingDetails,
};
