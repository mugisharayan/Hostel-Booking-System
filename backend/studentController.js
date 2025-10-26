const asyncHandler = require('express-async-handler');
const Student = require('../models/studentModel');
const Booking = require('../models/bookingModel');
const Payment = require('../models/paymentModel');
const MaintenanceRequest = require('../models/maintenanceRequestModel');

// @desc    Get all data for the student dashboard
// @route   GET /api/students/dashboard
// @access  Private (Student)
const getStudentDashboardData = asyncHandler(async (req, res) => {
  // Assuming req.user is populated by authentication middleware
  const studentId = req.user.id;

  if (!studentId) {
    res.status(401);
    throw new Error('Not authorized, no student ID found');
  }

  // 1. Fetch Student Profile
  const student = await Student.findById(studentId).select('-password');

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // 2. Fetch Current Booking (assuming one active booking at a time)
  const currentBooking = await Booking.findOne({
    student: studentId,
    status: { $in: ['Booked', 'Checked-in'] },
  })
    .populate('hostel', 'name')
    .populate('room', 'roomNumber roomType');

  // 3. Fetch Payment History for the current booking
  const paymentHistory = currentBooking
    ? await Payment.find({ booking: currentBooking._id }).sort({ createdAt: -1 }).limit(5)
    : [];

  // 4. Fetch Booking History (completed or cancelled bookings)
  const bookingHistory = await Booking.find({
    student: studentId,
    status: { $in: ['Completed', 'Cancelled'] },
  }).sort({ createdAt: -1 });

  // 5. Fetch Maintenance Requests
  const maintenanceRequests = await MaintenanceRequest.find({ student: studentId }).sort({ createdAt: -1 });

  // 6. Mock Notifications (a real implementation would use a dedicated collection)
  const notifications = [
      { id: 'n_001', type: 'reminder', message: 'Your next payment installment is due on September 15, 2024.' },
      { id: 'n_002', type: 'alert', message: 'Water maintenance scheduled for this Friday at 2 PM.' },
  ];

  res.status(200).json({
    student,
    currentBooking,
    paymentHistory,
    bookingHistory,
    maintenanceRequests,
    notifications,
  });
});

module.exports = {
  getStudentDashboardData,
};