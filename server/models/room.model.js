import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  roomType: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Booked', 'Partially Booked', 'Partially Available', 'Maintenance'],
    default: 'Available'
  },
  amenities: [{
    type: String
  }],
  currentOccupants: {
    type: Number,
    default: 0
  },
  assignedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

roomSchema.index({ hostel: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ hostel: 1, status: 1 });
roomSchema.index({ hostel: 1, floor: 1 });

const Room = mongoose.model('Room', roomSchema);
export default Room;