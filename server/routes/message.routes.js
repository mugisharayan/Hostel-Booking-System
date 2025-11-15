import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import Message from '../models/message.model.js';
import Hostel from '../models/hostel.model.js';

const router = express.Router();

// Get messages for student
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { recipient: req.user._id }
      ]
    })
    .populate('sender', 'name email role')
    .populate('recipient', 'name email role')
    .populate('hostel', 'name')
    .sort({ createdAt: -1 })
    .limit(50);
    
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send message from student to custodian
router.post('/', protect, async (req, res) => {
  try {
    const { hostelId, content } = req.body;
    
    // Find custodian for the hostel
    const hostel = await Hostel.findById(hostelId).populate('custodian');
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }
    
    const message = await Message.create({
      sender: req.user._id,
      recipient: hostel.custodian._id,
      hostel: hostelId,
      content,
      senderRole: 'student'
    });
    
    await message.populate('sender', 'name email role');
    await message.populate('recipient', 'name email role');
    await message.populate('hostel', 'name');
    
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark messages as read
router.put('/mark-read', protect, async (req, res) => {
  try {
    await Message.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );
    
    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;