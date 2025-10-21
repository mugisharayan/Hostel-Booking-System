const initiatePayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, phoneNumber } = req.body;
    console.log(`Initiating payment for booking ${bookingId} via ${paymentMethod} to ${phoneNumber}`);
    // In a real application, you would integrate with a payment gateway like Flutterwave here
    res.status(200).json({ success: true, message: 'Payment initiated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error initiating payment', error: error.message });
  }
};

module.exports = { initiatePayment };
