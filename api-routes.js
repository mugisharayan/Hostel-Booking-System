// API Routes Configuration - Express Router Setup
// File: server/routes/hostel.routes.js

import express from 'express';
import {
  getHostels,
  getHostelById,
  getHostelBySlug,
  createHostelReview,
} from '../controllers/hostel.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public Routes - No authentication required
router.route('/')
  .get(getHostels);  // GET /api/hostels - Advanced search & filter

router.route('/debug')
  .get(async (req, res) => {
    // Debug endpoint to check database connection
    try {
      const { default: Hostel } = await import('../models/hostel.model.js');
      const count = await Hostel.countDocuments();
      const hostels = await Hostel.find().limit(5);
      res.json({ count, sample: hostels });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Specific hostel routes
router.route('/slug/:slug')
  .get(getHostelBySlug);  // GET /api/hostels/slug/:slug

router.route('/:id')
  .get(getHostelById);    // GET /api/hostels/:id

// Protected Routes - Authentication required
router.route('/:id/reviews')
  .post(protect, createHostelReview);  // POST /api/hostels/:id/reviews

export default router;

// Usage in main server file (server.js):
// import hostelRoutes from './routes/hostel.routes.js';
// app.use('/api/hostels', hostelRoutes);