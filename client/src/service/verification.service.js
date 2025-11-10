import paymentService from './payment.service.js';

const verificationService = {
  // Verify payment completion
  verifyPaymentCompletion: async (transactionId, maxRetries = 3) => {
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        const result = await paymentService.verifyPayment(transactionId);
        
        if (result.status === 'completed') {
          return {
            verified: true,
            status: 'completed',
            message: 'Payment verified successfully'
          };
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
        retries++;
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          throw new Error('Payment verification failed after multiple attempts');
        }
      }
    }
    
    return {
      verified: false,
      status: 'pending',
      message: 'Payment verification timeout'
    };
  },

  // Validate payment amount
  validatePaymentAmount: (expectedAmount, actualAmount) => {
    const tolerance = 100; // UGX 100 tolerance
    return Math.abs(expectedAmount - actualAmount) <= tolerance;
  },

  // Check payment method availability
  checkPaymentMethodAvailability: async (paymentMethod) => {
    // Simulate checking payment gateway availability
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const availability = {
      'mobile-money': { available: true, message: 'Mobile Money available' },
      'credit-card': { available: true, message: 'Card payments available' },
      'bank-transfer': { available: true, message: 'Bank transfers available' }
    };
    
    return availability[paymentMethod] || { available: false, message: 'Payment method not supported' };
  }
};

export default verificationService;