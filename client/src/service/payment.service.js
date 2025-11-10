import apiService from './api.service.js';

const paymentService = {
  // Create payment for a booking
  createPayment: async (bookingId, paymentData) => {
    try {
      const response = await apiService.payments.create({
        bookingId,
        ...paymentData
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment failed');
    }
  },

  // Generate transaction ID
  generateTransactionId: () => {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
  },

  // Process mobile money payment with enhanced validation
  processMobileMoneyPayment: async (phoneNumber, amount, pin) => {
    // Validate inputs
    if (!phoneNumber || !amount || !pin) {
      throw new Error('Missing payment details');
    }
    
    if (pin.length !== 4) {
      throw new Error('PIN must be 4 digits');
    }
    
    if (amount < 1000) {
      throw new Error('Minimum payment amount is UGX 1,000');
    }
    
    // Simulate payment processing steps
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate different failure scenarios
    if (pin === '0000') {
      throw new Error('Invalid PIN');
    }
    if (phoneNumber.includes('999')) {
      throw new Error('Insufficient balance');
    }
    if (amount > 10000000) {
      throw new Error('Amount exceeds daily limit');
    }
    
    return {
      success: true,
      transactionId: paymentService.generateTransactionId(),
      message: 'Payment successful',
      timestamp: new Date().toISOString()
    };
  },

  // Process credit card payment
  processCreditCardPayment: async (cardData, amount) => {
    const { cardNumber, expiry, cvc } = cardData;
    
    // Basic validation
    if (!cardNumber || !expiry || !cvc) {
      throw new Error('Missing card details');
    }
    
    if (cardNumber.length < 16) {
      throw new Error('Invalid card number');
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate card validation
    if (cardNumber.startsWith('4000')) {
      throw new Error('Card declined');
    }
    
    return {
      success: true,
      transactionId: paymentService.generateTransactionId(),
      message: 'Card payment successful',
      timestamp: new Date().toISOString()
    };
  },

  // Verify payment status
  verifyPayment: async (transactionId) => {
    try {
      // In real implementation, this would check with payment gateway
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        status: 'completed',
        transactionId,
        verifiedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error('Payment verification failed');
    }
  }
};

export default paymentService;