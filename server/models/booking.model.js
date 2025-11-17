import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    // Reference to the payment document
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed', 'pending'],
      default: 'active',
    },
    // Additional fields for custodian dashboard
    roomName: {
      type: String,
    },
    hostelName: {
      type: String,
    },
    totalAmount: {
      type: Number,
    },
    paymentMethod: {
      type: String,
    },
    cancellationReason: {
      type: String,
    },
    cancelledAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;