import mongoose from 'mongoose';

const assignmentHistorySchema = new mongoose.Schema({
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  custodian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  roomType: {
    type: String,
    required: true
  },
  accessCode: {
    type: String,
    required: true
  },
  assignedBy: {
    type: String,
    required: true
  },
  assignmentDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
assignmentHistorySchema.index({ hostel: 1, assignmentDate: -1 });
assignmentHistorySchema.index({ custodian: 1, assignmentDate: -1 });

const AssignmentHistory = mongoose.model('AssignmentHistory', assignmentHistorySchema);

export default AssignmentHistory;