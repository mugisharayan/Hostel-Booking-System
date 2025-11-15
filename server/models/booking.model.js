import mongoose from 'mongoose';
import {
  BOOKING_STATUSES,
  PAYMENT_METHODS,
  createRequiredStringField,
  createOptionalStringField,
  createEnumField
} from '../utils/model.helpers.js';

const bookingSchema = new mongoose.Schema(
  {
    // Core booking information
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    hostel: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    
    // Booking dates
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function(date) {
          return date >= new Date();
        },
        message: 'Start date cannot be in the past'
      }
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function(date) {
          return date > this.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    
    // Payment information
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative']
    },
    paymentMethod: createEnumField(PAYMENT_METHODS),
    
    // Booking status
    status: {
      ...createEnumField(BOOKING_STATUSES),
      default: 'pending'
    },
    
    // Cached hostel and room names for performance
    hostelName: createOptionalStringField(),
    roomName: createOptionalStringField(),
    
    // Cancellation information
    cancellationReason: createOptionalStringField(),
    cancelledAt: { type: Date },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
bookingSchema.index({ student: 1, status: 1 });
bookingSchema.index({ startDate: 1, endDate: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ hostel: 1, room: 1 });

// Virtual fields
bookingSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // days
  }
  return 0;
});

bookingSchema.virtual('isActive').get(function() {
  return this.status === 'active' && this.endDate > new Date();
});

bookingSchema.virtual('isExpired').get(function() {
  return this.endDate < new Date();
});

// Instance methods
bookingSchema.methods.canBeCancelled = function() {
  return ['pending', 'active'].includes(this.status) && 
         this.startDate > new Date();
};

bookingSchema.methods.cancel = function(reason = 'No reason provided') {
  if (!this.canBeCancelled()) {
    throw new Error('Booking cannot be cancelled');
  }
  
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  
  return this.save();
};

bookingSchema.methods.confirm = function() {
  if (this.status !== 'pending') {
    throw new Error('Only pending bookings can be confirmed');
  }
  
  this.status = 'active';
  return this.save();
};

// Static methods
bookingSchema.statics.findActiveBookings = function(userId) {
  return this.find({
    student: userId,
    status: { $ne: 'cancelled' },
    endDate: { $gte: new Date() }
  });
};

bookingSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    $or: [
      { startDate: { $gte: startDate, $lte: endDate } },
      { endDate: { $gte: startDate, $lte: endDate } },
      { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
    ]
  });
};

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;