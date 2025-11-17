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
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priceRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    totalRooms: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
  },
  { timestamps: true }
);

// Add indexes for better query performance
hostelSchema.index({ location: 1, isActive: 1 });
hostelSchema.index({ custodian: 1 });
hostelSchema.index({ 'priceRange.min': 1, 'priceRange.max': 1 });
hostelSchema.index({ name: 'text', description: 'text' });

const Hostel = mongoose.model('Hostel', hostelSchema);
export default Hostel;