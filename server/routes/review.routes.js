import express from 'express';
import { createReview, getHostelReviews, getMyReviews } from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/hostel/:hostelId', getHostelReviews);
router.get('/my-reviews', protect, getMyReviews);

export default router;
