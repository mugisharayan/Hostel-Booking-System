import api from './api';

export const initiatePayment = async (bookingId, paymentMethod, phoneNumber) => {
  const response = await api.post('/payments/initiate', {
    bookingId,
    paymentMethod,
    phoneNumber
  });
  return response.data;
};

export const processPayment = async (paymentId, paymentToken) => {
  const response = await api.post('/payments/process', {
    paymentId,
    paymentToken
  });
  return response.data;
};

export const getPaymentDetails = async (paymentId) => {
  const response = await api.get(`/payments/${paymentId}`);
  return response.data;
};