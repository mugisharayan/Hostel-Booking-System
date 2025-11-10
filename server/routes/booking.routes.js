import express from 'express';
import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/').post(protect, createBooking);
router.route('/my-bookings').get(protect, getMyBookings);
router.route('/:id/cancel').put(protect, cancelBooking);

export default router;