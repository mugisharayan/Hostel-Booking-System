import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Single', 'Double', 'Triple'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', roomSchema);
export default Room;