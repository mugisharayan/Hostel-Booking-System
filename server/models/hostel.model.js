import mongoose from 'mongoose';
import {
  createRequiredStringField,
  createOptionalStringField
} from '../utils/model.helpers.js';

// Sub-schemas for better organization
const amenitySchema = new mongoose.Schema({
  name: createRequiredStringField(),
  icon: createRequiredStringField(),
  description: createOptionalStringField()
}, { _id: false });

const roomSchema = new mongoose.Schema({
  name: createRequiredStringField(),
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  description: createRequiredStringField(),
  icon: createRequiredStringField(),
  capacity: {
    type: Number,
    default: 1,
    min: [1, 'Capacity must be at least 1']
  },
  available: {
    type: Boolean,
    default: true
  },
  features: [createOptionalStringField()]
}, { _id: true });

const hostelSchema = new mongoose.Schema(
  {
    // Basic information
    name: {
      ...createRequiredStringField(),
      unique: true,
      index: true
    },
    location: createRequiredStringField(),
    contact: {
      ...createRequiredStringField(),
      validate: {
        validator: function(contact) {
          // Basic phone number validation
          return /^[+]?[0-9\s\-()]{10,}$/.test(contact);
        },
        message: 'Please provide a valid contact number'
      }
    },
    
    // Media and content
    images: [{
      type: String,
      validate: {
        validator: function(url) {
          return /^https?:\/\/.+/.test(url);
        },
        message: 'Please provide a valid image URL'
      }
    }],
    description: createOptionalStringField(),
    
    // Hostel features
    amenities: [amenitySchema],
    rooms: [roomSchema],
    
    // SEO and identification
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true
    },
    
    // Ratings and reviews
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative']
    },
    
    // Management
    custodian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    
    // Status and availability
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    
    // Additional metadata
    address: createOptionalStringField(),
    website: createOptionalStringField(),
    socialMedia: {
      facebook: createOptionalStringField(),
      instagram: createOptionalStringField(),
      twitter: createOptionalStringField()
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
hostelSchema.index({ location: 1, isActive: 1 });
hostelSchema.index({ averageRating: -1 });
hostelSchema.index({ name: 'text', location: 'text', description: 'text' });
hostelSchema.index({ 'rooms.price': 1 });

// Virtual fields
hostelSchema.virtual('priceRange').get(function() {
  if (!this.rooms || this.rooms.length === 0) return null;
  
  const prices = this.rooms.map(room => room.price).filter(price => price > 0);
  if (prices.length === 0) return null;
  
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  
  return { min, max };
});

hostelSchema.virtual('availableRooms').get(function() {
  if (!this.rooms) return [];
  return this.rooms.filter(room => room.available);
});

hostelSchema.virtual('totalRooms').get(function() {
  return this.rooms ? this.rooms.length : 0;
});

hostelSchema.virtual('isPopular').get(function() {
  return this.averageRating >= 4.0 && this.totalReviews >= 10;
});

// Pre-save middleware
hostelSchema.pre('save', function(next) {
  // Auto-generate slug if not provided
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Instance methods
hostelSchema.methods.addRoom = function(roomData) {
  this.rooms.push(roomData);
  return this.save();
};

hostelSchema.methods.removeRoom = function(roomId) {
  this.rooms.id(roomId).remove();
  return this.save();
};

hostelSchema.methods.updateRoom = function(roomId, updateData) {
  const room = this.rooms.id(roomId);
  if (room) {
    Object.assign(room, updateData);
    return this.save();
  }
  throw new Error('Room not found');
};

hostelSchema.methods.addAmenity = function(amenityData) {
  this.amenities.push(amenityData);
  return this.save();
};

hostelSchema.methods.updateRating = function(newRating, isNewReview = true) {
  if (isNewReview) {
    const totalRating = this.averageRating * this.totalReviews + newRating;
    this.totalReviews += 1;
    this.averageRating = totalRating / this.totalReviews;
  } else {
    // Recalculate from all reviews (would need review data)
    this.averageRating = newRating;
  }
  
  return this.save();
};

hostelSchema.methods.toggleActiveStatus = function() {
  this.isActive = !this.isActive;
  return this.save();
};

hostelSchema.methods.verify = function() {
  this.isVerified = true;
  return this.save();
};

// Static methods
hostelSchema.statics.findByLocation = function(location) {
  return this.find({ 
    location: new RegExp(location, 'i'),
    isActive: true 
  });
};

hostelSchema.statics.findByPriceRange = function(minPrice, maxPrice) {
  return this.find({
    'rooms.price': { $gte: minPrice, $lte: maxPrice },
    isActive: true
  });
};

hostelSchema.statics.findPopular = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ averageRating: -1, totalReviews: -1 })
    .limit(limit);
};

hostelSchema.statics.searchHostels = function(query) {
  return this.find({
    $text: { $search: query },
    isActive: true
  }).sort({ score: { $meta: 'textScore' } });
};

hostelSchema.statics.findByCustodian = function(custodianId) {
  return this.find({ custodian: custodianId });
};

const Hostel = mongoose.model('Hostel', hostelSchema);
export default Hostel;