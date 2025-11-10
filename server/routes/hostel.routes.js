import express from 'express';
import {
  getHostels,
  getHostelById,
  getHostelBySlug,
  createHostelReview,
} from '../controllers/hostel.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/').get(getHostels);
router.route('/debug').get(async (req, res) => {
  try {
    const { default: Hostel } = await import('../models/hostel.model.js');
    const count = await Hostel.countDocuments();
    const hostels = await Hostel.find().limit(5);
    res.json({ count, sample: hostels });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.route('/slug/:slug').get(getHostelBySlug);
router.route('/:id').get(getHostelById);
router.route('/:id/reviews').post(protect, createHostelReview);

export default router;