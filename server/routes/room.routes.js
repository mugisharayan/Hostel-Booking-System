import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import Room from '../models/room.model.js';
import Hostel from '../models/hostel.model.js';

const router = express.Router();

// Get all rooms for custodian's hostel
router.get('/', protect, async (req, res) => {
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

// Create new room
router.post('/', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    const room = await Room.create({
      ...req.body,
      hostel: hostel._id
    });

    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update room
router.put('/:id', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    const room = await Room.findOneAndUpdate(
      { _id: req.params.id, hostel: hostel._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete room
router.delete('/:id', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    const room = await Room.findOneAndDelete({ _id: req.params.id, hostel: hostel._id });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;