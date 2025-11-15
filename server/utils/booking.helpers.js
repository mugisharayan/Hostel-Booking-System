import mongoose from 'mongoose';
import { isObjectIdString } from './validation.js';

// Helper functions for booking operations
export const resolveHostelReference = async (hostelInput) => {
  const Hostel = (await import('../models/hostel.model.js')).default;
  
  // If it's already an ObjectId, return as is
  if (isObjectIdString(hostelInput)) {
    return {
      id: hostelInput,
      name: hostelInput // Will be resolved later
    };
  }
  
  // If it's a string name, find the hostel
  if (typeof hostelInput === 'string') {
    const hostel = await Hostel.findOne({ 
      name: new RegExp(hostelInput, 'i') 
    });
    
    return {
      id: hostel ? hostel._id : hostelInput,
      name: hostel ? hostel.name : hostelInput
    };
  }
  
  throw new Error('Invalid hostel reference');
};

export const resolveRoomReference = (roomInput) => {
  return {
    id: roomInput,
    name: typeof roomInput === 'string' ? roomInput : roomInput
  };
};

export const enrichBookingWithHostelData = async (booking) => {
  const Hostel = (await import('../models/hostel.model.js')).default;
  const bookingObj = booking.toObject();
  
  // Handle hostel data
  if (mongoose.Types.ObjectId.isValid(booking.hostel)) {
    const hostel = await Hostel.findById(booking.hostel);
    if (hostel) {
      bookingObj.hostelName = hostel.name;
      bookingObj.hostelLocation = hostel.location;
      
      // Handle room data
      const roomData = resolveRoomFromHostel(hostel, booking.room);
      Object.assign(bookingObj, roomData);
    }
  } else {
    // Hostel is a string (name)
    bookingObj.hostelName = booking.hostel;
    bookingObj.roomName = booking.room;
  }
  
  return bookingObj;
};

const resolveRoomFromHostel = (hostel, roomReference) => {
  if (mongoose.Types.ObjectId.isValid(roomReference)) {
    const room = hostel.rooms.id(roomReference);
    return room ? {
      roomName: room.name,
      roomPrice: room.price,
      roomType: room.type
    } : {};
  }
  
  // Room is a string, find by name
  const room = hostel.rooms.find(r => r.name === roomReference);
  return room ? {
    roomName: room.name,
    roomPrice: room.price,
    roomType: room.type
  } : {
    roomName: roomReference
  };
};

export const checkExistingBooking = async (userId) => {
  const Booking = (await import('../models/booking.model.js')).default;
  
  return await Booking.findOne({
    student: userId,
    status: { $ne: 'cancelled' },
    endDate: { $gte: new Date() }
  });
};