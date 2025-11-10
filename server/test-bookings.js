import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './models/booking.model.js';
import User from './models/user.model.js';

dotenv.config();

const testBookings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check all bookings
    const allBookings = await Booking.find({}).populate('student', 'name email');
    console.log('Total bookings in database:', allBookings.length);
    
    // Check Lyn Modern Hostel bookings
    const lynBookings = await Booking.find({
      $or: [
        { hostel: { $regex: new RegExp('Lyn Modern Hostel', 'i') } },
        { hostelName: { $regex: new RegExp('Lyn Modern Hostel', 'i') } }
      ]
    }).populate('student', 'name email');
    
    console.log('Lyn Modern Hostel bookings:', lynBookings.length);
    
    if (lynBookings.length > 0) {
      console.log('Sample booking:', JSON.stringify(lynBookings[0], null, 2));
    }
    
    // Check users
    const users = await User.find({});
    console.log('Total users:', users.length);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testBookings();