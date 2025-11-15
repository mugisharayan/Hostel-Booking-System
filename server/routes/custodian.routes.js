import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import User from '../models/user.model.js';
import Hostel from '../models/hostel.model.js';
import Booking from '../models/booking.model.js';
import Payment from '../models/payment.model.js';
import Room from '../models/room.model.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Create new hostel
router.post('/create-hostel', protect, async (req, res) => {
  try {
    const { name, location, description, contact, amenities, rooms, images, priceRange } = req.body;
    
    // Check if custodian already has a hostel
    const existingHostel = await Hostel.findOne({ custodian: req.user._id });
    if (existingHostel) {
      return res.status(400).json({
        success: false,
        message: 'You already have a hostel registered'
      });
    }
    
    // Check if hostel name already exists
    const nameExists = await Hostel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (nameExists) {
      return res.status(400).json({
        success: false,
        message: 'Hostel name already exists'
      });
    }
    
    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Validate and format amenities
    const formattedAmenities = (amenities || []).map(amenity => {
      if (typeof amenity === 'string') {
        return { name: amenity, icon: 'fa-check' };
      }
      return { name: amenity.name, icon: amenity.icon || 'fa-check' };
    });

    // Validate and format rooms
    const formattedRooms = (rooms || []).map(room => ({
      name: room.name,
      price: Number(room.price),
      description: room.description || '',
      icon: room.icon || 'fa-bed'
    }));

    // Create new hostel
    const hostel = await Hostel.create({
      name,
      location,
      description,
      contact,
      amenities: formattedAmenities,
      rooms: formattedRooms,
      images: images || [],
      priceRange: {
        min: Number(priceRange.min),
        max: Number(priceRange.max)
      },
      totalRooms: formattedRooms.length,
      slug,
      custodian: req.user._id
    });
    
    res.status(201).json({
      success: true,
      data: hostel,
      message: 'Hostel created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get custodian dashboard data
router.get('/dashboard-data', protect, async (req, res) => {
  try {
    // Find hostel owned by this custodian
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    
    if (!hostel) {
      return res.json({
        success: true,
        data: null,
        message: 'No hostel found. Please create a hostel first.'
      });
    }
    
    // Get rooms for this hostel
    const rooms = await Room.find({ hostel: hostel._id }).populate('assignedStudents', 'name email phone');
    
    // Get bookings for this hostel
    const bookings = await Booking.find({ 
      $or: [
        { hostel: hostel._id },
        { hostelName: hostel.name }
      ]
    }).populate('student', 'name email phone');
    
    // Get payments for this hostel
    const payments = await Payment.find({ hostel: hostel._id })
      .populate('student', 'name email')
      .populate('booking', 'roomName startDate endDate');
    
    // Calculate room statistics
    const roomStats = {
      total: rooms.length,
      occupied: rooms.filter(r => r.status === 'Booked' || r.status === 'Partially Booked').length,
      available: rooms.filter(r => r.status === 'Available' || r.status === 'Partially Available').length,
      maintenance: rooms.filter(r => r.status === 'Maintenance').length,
      occupancyRate: rooms.length > 0 ? Math.round((rooms.filter(r => r.currentOccupants > 0).length / rooms.length) * 100) : 0
    };
    
    // Calculate analytics data
    const analytics = await calculateHostelAnalytics(hostel._id, bookings, payments);
    
    res.json({
      success: true,
      data: {
        hostel,
        rooms,
        bookings,
        payments,
        analytics,
        roomStats,
        stats: {
          totalRooms: rooms.length,
          occupiedRooms: roomStats.occupied,
          availableRooms: roomStats.available,
          totalRevenue: analytics.totalRevenue,
          monthlyRevenue: analytics.monthlyRevenue,
          totalBookings: analytics.totalBookings,
          activeBookings: analytics.activeBookings
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get custodian profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update custodian profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, phone, profilePicture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone, profilePicture },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Change password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get my hostel
router.get('/my-hostel', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    
    if (!hostel) {
      return res.json({
        success: true,
        data: null,
        message: 'No hostel found'
      });
    }
    
    res.json({
      success: true,
      data: hostel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update hostel
router.put('/update-hostel', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOneAndUpdate(
      { custodian: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }
    
    res.json({
      success: true,
      data: hostel,
      message: 'Hostel updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get bookings for custodian's hostel
router.get('/bookings', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.json({ success: true, data: [] });
    }
    
    const bookings = await Booking.find({ 
      $or: [
        { hostel: hostel._id },
        { hostelName: hostel.name }
      ]
    }).populate('student', 'name email phone').sort({ createdAt: -1 });
    
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get payments for custodian's hostel
router.get('/payments', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.json({ success: true, data: [] });
    }
    
    const payments = await Payment.find({ hostel: hostel._id })
      .populate('student', 'name email')
      .populate('booking', 'roomName startDate endDate')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Approve payment
router.put('/payments/:paymentId/approve', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }
    
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.paymentId, hostel: hostel._id },
      { status: 'Approved' },
      { new: true }
    ).populate('student', 'name email').populate('booking');
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    res.json({ success: true, data: payment, message: 'Payment approved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Assign room to approved payment
router.put('/assign-room/:paymentId', protect, async (req, res) => {
  try {
    const { roomId } = req.body;
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }
    
    // Update payment status to Completed (room assigned)
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.paymentId, hostel: hostel._id, status: 'Approved' },
      { status: 'Completed' },
      { new: true }
    ).populate('student', 'name email').populate('booking');
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found or not approved' });
    }
    
    // Update room occupancy
    const room = await Room.findOneAndUpdate(
      { _id: roomId, hostel: hostel._id },
      { 
        $inc: { currentOccupants: 1 },
        $push: { assignedStudents: payment.student._id }
      },
      { new: true }
    );
    
    if (room) {
      // Update room status based on occupancy
      const newStatus = room.currentOccupants >= room.capacity ? 'Booked' : 'Partially Booked';
      room.status = newStatus;
      await room.save();
      
      // Generate access code
      const accessCode = `${room.roomNumber}-${Date.now().toString().slice(-6)}`;
      
      // Create notification for student
      const Notification = (await import('../models/notification.model.js')).default;
      await Notification.create({
        recipient: payment.student._id,
        type: 'room_assignment',
        title: 'Room Assigned Successfully!',
        message: `Your room ${room.roomNumber} at ${hostel.name} has been assigned. Use access code: ${accessCode}`,
        data: {
          roomNumber: room.roomNumber,
          accessCode: accessCode,
          hostelName: hostel.name,
          paymentId: payment._id.toString(),
          bookingId: payment.booking._id.toString()
        }
      });
      
      // Create assignment history record
      const AssignmentHistory = (await import('../models/assignmentHistory.model.js')).default;
      await AssignmentHistory.create({
        hostel: hostel._id,
        custodian: req.user._id,
        student: payment.student._id,
        room: room._id,
        payment: payment._id,
        booking: payment.booking._id,
        studentName: payment.student.name,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        accessCode: accessCode,
        assignedBy: req.user.name || 'Custodian',
        assignmentDate: new Date()
      });
    }
    
    res.json({ success: true, data: payment, message: 'Room assigned successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reject payment
router.put('/payments/:paymentId/reject', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }
    
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.paymentId, hostel: hostel._id },
      { status: 'Rejected' },
      { new: true }
    ).populate('student', 'name email').populate('booking');
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    res.json({ success: true, data: payment, message: 'Payment rejected successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get approved payments pending room assignment
router.get('/pending-assignments', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.json({ success: true, data: [] });
    }
    
    const approvedPayments = await Payment.find({ 
      hostel: hostel._id,
      status: 'Approved'
    })
    .populate('student', 'name email phone')
    .populate('booking', 'roomName startDate endDate')
    .sort({ createdAt: -1 });
    
    // Transform to pending assignment format
    const pendingAssignments = approvedPayments.map(payment => ({
      id: payment._id,
      paymentId: payment._id,
      bookingId: payment.booking._id,
      name: payment.student.name,
      studentId: payment.student.email?.split('@')[0] || 'N/A',
      email: payment.student.email,
      phone: payment.student.phone,
      paidOn: new Date(payment.createdAt).toLocaleDateString('en-GB'),
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      preferences: payment.booking.roomName || 'Any room',
      priority: 'high',
      paymentAmount: payment.amount.toLocaleString(),
      roomRequested: payment.booking.roomName
    }));
    
    res.json({ success: true, data: pendingAssignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get rooms for custodian's hostel
router.get('/rooms', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.json({ success: true, data: [] });
    }
    
    const rooms = await Room.find({ hostel: hostel._id })
      .populate('assignedStudents', 'name email phone')
      .sort({ floor: 1, roomNumber: 1 });
    
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create room for custodian's hostel
router.post('/rooms', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }
    
    const roomData = {
      ...req.body,
      hostel: hostel._id
    };
    
    const room = await Room.create(roomData);
    await room.populate('assignedStudents', 'name email phone');
    
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update room for custodian's hostel
router.put('/rooms/:roomId', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }
    
    const room = await Room.findOneAndUpdate(
      { _id: req.params.roomId, hostel: hostel._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedStudents', 'name email phone');
    
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete room for custodian's hostel
router.delete('/rooms/:roomId', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }
    
    const room = await Room.findOneAndDelete({ _id: req.params.roomId, hostel: hostel._id });
    
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Seed sample rooms for custodian's hostel (development only)
router.post('/seed-rooms', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }
    
    // Check if rooms already exist
    const existingRooms = await Room.find({ hostel: hostel._id });
    if (existingRooms.length > 0) {
      return res.json({ success: true, message: 'Rooms already exist', data: existingRooms });
    }
    
    // Create sample rooms
    const sampleRooms = [
      { roomNumber: 'A-101', floor: 1, roomType: 'Single', capacity: 1, price: 850000, amenities: ['WiFi', 'AC', 'Private Bathroom'] },
      { roomNumber: 'A-102', floor: 1, roomType: 'Double', capacity: 2, price: 650000, amenities: ['WiFi', 'Shared Bathroom'] },
      { roomNumber: 'A-103', floor: 1, roomType: 'Single', capacity: 1, price: 850000, amenities: ['WiFi', 'AC', 'Private Bathroom'], status: 'Booked', currentOccupants: 1 },
      { roomNumber: 'A-201', floor: 2, roomType: 'Double', capacity: 2, price: 650000, amenities: ['WiFi', 'Shared Bathroom'] },
      { roomNumber: 'A-202', floor: 2, roomType: 'Triple', capacity: 3, price: 500000, amenities: ['WiFi', 'Shared Bathroom'] },
      { roomNumber: 'A-203', floor: 2, roomType: 'Single', capacity: 1, price: 850000, amenities: ['WiFi', 'AC', 'Private Bathroom'] },
      { roomNumber: 'B-101', floor: 1, roomType: 'Studio', capacity: 1, price: 1200000, amenities: ['WiFi', 'AC', 'Private Bathroom', 'Kitchenette'] },
      { roomNumber: 'B-102', floor: 1, roomType: 'Double', capacity: 2, price: 650000, amenities: ['WiFi', 'Shared Bathroom'], status: 'Partially Booked', currentOccupants: 1 },
      { roomNumber: 'B-201', floor: 2, roomType: 'Private', capacity: 1, price: 950000, amenities: ['WiFi', 'AC', 'Private Bathroom', 'Balcony'] },
      { roomNumber: 'B-202', floor: 2, roomType: 'Shared', capacity: 4, price: 400000, amenities: ['WiFi', 'Shared Bathroom'] }
    ];
    
    const roomsWithHostel = sampleRooms.map(room => ({ ...room, hostel: hostel._id }));
    const createdRooms = await Room.insertMany(roomsWithHostel);
    
    res.status(201).json({ 
      success: true, 
      message: `${createdRooms.length} sample rooms created successfully`,
      data: createdRooms 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get maintenance requests for custodian's hostel
router.get('/maintenance-requests', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.json({ success: true, data: [] });
    }
    
    const MaintenanceRequest = (await import('../models/maintenanceRequest.model.js')).default;
    const requests = await MaintenanceRequest.find({
      $or: [
        { hostel: hostel._id },
        { hostel: null }, // Include requests without hostel assignment
        { hostel: { $exists: false } }
      ]
    })
    .populate('student', 'name email')
    .sort({ createdAt: -1 });
    
    const formattedRequests = requests.map(request => ({
      id: request._id,
      room: request.roomNumber,
      issue: request.category.charAt(0).toUpperCase() + request.category.slice(1),
      priority: 'Medium', // Default priority
      description: request.description,
      submittedBy: request.student.name,
      submittedOn: new Date(request.createdAt).toLocaleDateString('en-GB'),
      status: request.status,
      category: request.category
    }));
    
    res.json({ success: true, data: formattedRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update maintenance request status
router.put('/maintenance-requests/:requestId', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const MaintenanceRequest = (await import('../models/maintenanceRequest.model.js')).default;
    
    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.requestId,
      { status },
      { new: true }
    ).populate('student', 'name email');
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    
    // Update room status based on maintenance request status
    if (request.roomNumber) {
      const Room = (await import('../models/room.model.js')).default;
      const hostel = await Hostel.findOne({ custodian: req.user._id });
      
      if (hostel) {
        let roomStatus = 'Available';
        if (status === 'In Progress') {
          roomStatus = 'Maintenance';
        } else if (status === 'Resolved') {
          // Check if room has occupants to determine correct status
          const room = await Room.findOne({ roomNumber: request.roomNumber, hostel: hostel._id });
          if (room && room.currentOccupants > 0) {
            roomStatus = room.currentOccupants >= room.capacity ? 'Booked' : 'Partially Booked';
          } else {
            roomStatus = 'Available';
          }
        }
        
        await Room.findOneAndUpdate(
          { roomNumber: request.roomNumber, hostel: hostel._id },
          { status: roomStatus }
        );
      }
    }
    
    res.json({ success: true, data: request, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get messages for custodian's hostel
router.get('/messages', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.json({ success: true, data: [] });
    }
    
    const Message = (await import('../models/message.model.js')).default;
    const messages = await Message.find({ hostel: hostel._id })
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send message from custodian to student
router.post('/messages', protect, async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }
    
    const Message = (await import('../models/message.model.js')).default;
    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      hostel: hostel._id,
      content,
      senderRole: 'custodian'
    });
    
    await message.populate('sender', 'name email role');
    await message.populate('recipient', 'name email role');
    
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark messages as read
router.put('/messages/mark-read', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }
    
    const Message = (await import('../models/message.model.js')).default;
    await Message.updateMany(
      { hostel: hostel._id, recipient: req.user._id, isRead: false },
      { isRead: true }
    );
    
    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get custodian notifications
router.get('/notifications', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.json({ success: true, data: [] });
    }
    
    const notifications = [];
    
    // Get pending payments
    const pendingPayments = await Payment.find({ 
      hostel: hostel._id, 
      status: 'Pending' 
    }).populate('student', 'name email').sort({ createdAt: -1 });
    
    pendingPayments.forEach(payment => {
      notifications.push({
        id: `payment-${payment._id}`,
        type: 'payment',
        title: 'New Payment Received',
        message: `${payment.student.name} has submitted a payment of UGX ${payment.amount.toLocaleString()}`,
        createdAt: payment.createdAt,
        isRead: false
      });
    });
    
    // Get pending maintenance requests
    const MaintenanceRequest = (await import('../models/maintenanceRequest.model.js')).default;
    const pendingMaintenance = await MaintenanceRequest.find({
      $or: [
        { hostel: hostel._id },
        { hostel: null },
        { hostel: { $exists: false } }
      ],
      status: 'Pending'
    }).populate('student', 'name email').sort({ createdAt: -1 });
    
    pendingMaintenance.forEach(request => {
      notifications.push({
        id: `maintenance-${request._id}`,
        type: 'maintenance',
        title: 'New Maintenance Request',
        message: `${request.student.name} reported a ${request.category} issue in room ${request.roomNumber}`,
        createdAt: request.createdAt,
        isRead: false
      });
    });
    
    // Sort by creation date
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get assignment history for custodian's hostel
router.get('/assignment-history', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.json({ success: true, data: [] });
    }
    
    const AssignmentHistory = (await import('../models/assignmentHistory.model.js')).default;
    const history = await AssignmentHistory.find({ hostel: hostel._id })
      .populate('student', 'name email')
      .populate('room', 'roomNumber roomType')
      .sort({ assignmentDate: -1 })
      .limit(50);
    
    const formattedHistory = history.map(record => ({
      id: record._id,
      studentName: record.studentName,
      room: record.roomNumber,
      roomType: record.roomType,
      assignedBy: record.assignedBy,
      accessCode: record.accessCode,
      time: getTimeAgo(record.assignmentDate),
      assignmentDate: record.assignmentDate.toISOString()
    }));
    
    res.json({ success: true, data: formattedHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper function to get time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Calculate hostel analytics
async function calculateHostelAnalytics(hostelId, bookings = null, payments = null) {
  try {
    if (!bookings) {
      bookings = await Booking.find({ hostel: hostelId });
    }
    if (!payments) {
      payments = await Payment.find({ hostel: hostelId });
    }
    
    const totalRevenue = payments
      .filter(p => p.status === 'Completed' || p.status === 'Approved')
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);
    
    const currentMonth = new Date().getMonth();
    const monthlyRevenue = payments
      .filter(p => new Date(p.createdAt).getMonth() === currentMonth && (p.status === 'Completed' || p.status === 'Approved'))
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);
    
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => {
      const endDate = new Date(b.endDate);
      return endDate > new Date() && b.status !== 'cancelled';
    }).length;
    
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    
    return {
      totalRevenue,
      monthlyRevenue,
      totalBookings,
      activeBookings,
      pendingPayments,
      pendingBookings,
      occupancyRate: totalBookings > 0 ? Math.round((activeBookings / totalBookings) * 100) : 0
    };
  } catch (error) {
    console.error('Analytics calculation error:', error);
    return {
      totalRevenue: 0,
      monthlyRevenue: 0,
      totalBookings: 0,
      activeBookings: 0,
      pendingPayments: 0,
      pendingBookings: 0,
      occupancyRate: 0
    };
  }
}

export default router;