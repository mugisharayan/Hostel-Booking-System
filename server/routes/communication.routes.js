import express from 'express';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Send message to custodian
router.post('/messages', protect, async (req, res) => {
  try {
    const { message, recipientType = 'custodian' } = req.body;
    
    // In a real implementation, save to database
    const messageData = {
      _id: Date.now().toString(),
      sender: req.user._id,
      senderName: req.user.fullName,
      message,
      recipientType,
      timestamp: new Date(),
      status: 'sent'
    };
    
    res.status(201).json({
      success: true,
      data: messageData,
      message: 'Message sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get messages
router.get('/messages', protect, async (req, res) => {
  try {
    // In a real implementation, fetch from database
    const messages = [];
    
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create payment inquiry
router.post('/payment-inquiry', protect, async (req, res) => {
  try {
    const { inquiryType, subject, description } = req.body;
    
    const inquiry = {
      _id: Date.now().toString(),
      student: req.user._id,
      studentName: req.user.fullName,
      inquiryType,
      subject,
      description,
      status: 'pending',
      createdAt: new Date()
    };
    
    res.status(201).json({
      success: true,
      data: inquiry,
      message: 'Payment inquiry created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create room request
router.post('/room-request', protect, async (req, res) => {
  try {
    const { currentRoom, preferredRoom, reason } = req.body;
    
    const request = {
      _id: Date.now().toString(),
      student: req.user._id,
      studentName: req.user.fullName,
      currentRoom,
      preferredRoom,
      reason,
      status: 'pending',
      createdAt: new Date()
    };
    
    res.status(201).json({
      success: true,
      data: request,
      message: 'Room request created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create support ticket
router.post('/support-ticket', protect, async (req, res) => {
  try {
    const { category, priority, subject, description } = req.body;
    
    const ticket = {
      _id: Date.now().toString(),
      student: req.user._id,
      studentName: req.user.fullName,
      category,
      priority,
      subject,
      description,
      status: 'open',
      createdAt: new Date()
    };
    
    res.status(201).json({
      success: true,
      data: ticket,
      message: 'Support ticket created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create emergency contact
router.post('/emergency', protect, async (req, res) => {
  try {
    const { emergencyType, description, location, contactNumber } = req.body;
    
    const emergency = {
      _id: Date.now().toString(),
      student: req.user._id,
      studentName: req.user.fullName,
      emergencyType,
      description,
      location,
      contactNumber,
      status: 'reported',
      priority: 'high',
      createdAt: new Date()
    };
    
    res.status(201).json({
      success: true,
      data: emergency,
      message: 'Emergency contact created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;