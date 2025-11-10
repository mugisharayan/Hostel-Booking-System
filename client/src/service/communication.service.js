import apiService from './api.service.js';

const communicationService = {
  // Send message to custodian
  sendMessage: async (messageData) => {
    try {
      const response = await apiService.communication.sendMessage(messageData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  },

  // Get messages
  getMessages: async () => {
    try {
      const response = await apiService.communication.getMessages();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
  },

  // Create payment inquiry
  createPaymentInquiry: async (inquiryData) => {
    try {
      const response = await apiService.communication.createPaymentInquiry(inquiryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create payment inquiry');
    }
  },

  // Create room request
  createRoomRequest: async (requestData) => {
    try {
      const response = await apiService.communication.createRoomRequest(requestData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create room request');
    }
  },

  // Create support ticket
  createSupportTicket: async (ticketData) => {
    try {
      const response = await apiService.communication.createSupportTicket(ticketData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create support ticket');
    }
  },

  // Create emergency contact
  createEmergencyContact: async (emergencyData) => {
    try {
      const response = await apiService.communication.createEmergencyContact(emergencyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create emergency contact');
    }
  }
};

export default communicationService;