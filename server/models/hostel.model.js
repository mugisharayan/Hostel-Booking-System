import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    images: [{
      type: String,
    }],
    contact: {
      type: String,
      required: true,
    },
    amenities: [{
      name: { type: String, required: true },
      icon: { type: String, required: true }
    }],
    rooms: [{
      name: { type: String, required: true },
      price: { type: Number, required: true },
      description: { type: String, required: true },
      icon: { type: String, required: true }
    }],
    slug: {
      type: String,
      unique: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    custodian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Hostel = mongoose.model('Hostel', hostelSchema);
export default Hostel;