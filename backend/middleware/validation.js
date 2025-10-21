

class PaymentValidation {
  static validateInitiation(req, res, next) {
    const { bookingId, paymentMethod, phoneNumber } = req.body;
    
    if (!bookingId) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }
    
    if (!paymentMethod) {
      return res.status(400).json({ error: 'Payment method is required' });
    }
    
    if (paymentMethod === 'mobile_money' && !phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required for mobile money' });
    }
    
    next();
  }

  static validateProcessing(req, res, next) {
    const { paymentId, paymentToken } = req.body;
    
    if (!paymentId || !paymentToken) {
      return res.status(400).json({ 
        error: 'Payment ID and token are required' 
      });
    }
    
    next();
  }
}

module.exports = PaymentValidation;