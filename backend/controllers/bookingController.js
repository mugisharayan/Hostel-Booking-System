const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    // In a real application, you would fetch this from your database
    // For now, we'll return mock data
    const mockBooking = {
      _id: bookingId,
      room: { roomType: 'Single room', roomNumber: '101' },
      totalAmount: 1200000,
    };
    res.status(200).json({ success: true, booking: mockBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking details', error: error.message });
  }
};

module.exports = { getBookingDetails };
