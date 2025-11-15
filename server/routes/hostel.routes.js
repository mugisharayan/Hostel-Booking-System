import {
  getHostels,
  getHostelById,
  getHostelBySlug,
  createHostelReview,
} from '../controllers/hostel.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  createRouter,
  protectedRoutes,
  validateRouteParams,
  routeDoc
} from '../utils/route.helpers.js';
import { validateObjectId } from '../utils/validation.js';

const router = createRouter();

// Validation middleware
const validateHostelId = validateRouteParams({
  id: validateObjectId
});

const validateSlug = validateRouteParams({
  slug: (slug) => slug && slug.length > 0
});

// Public routes
router.route('/')
  .get(getHostels); // Get all hostels with filtering

router.route('/slug/:slug')
  .get(validateSlug, getHostelBySlug); // Get hostel by slug

router.route('/:id')
  .get(validateHostelId, getHostelById); // Get hostel by ID

// Protected routes
router.route('/:id/reviews')
  .post(validateHostelId, ...protectedRoutes(protect), createHostelReview); // Create review

// Development/Debug routes
if (process.env.NODE_ENV === 'development') {
  router.route('/debug').get(async (req, res) => {
    try {
      const { default: Hostel } = await import('../models/hostel.model.js');
      const count = await Hostel.countDocuments();
      const hostels = await Hostel.find().limit(5);
      res.json({ 
        success: true,
        data: { count, sample: hostels }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Debug query failed',
        error: error.message 
      });
    }
  });
}

// Route documentation
export const hostelRoutesDocs = [
  routeDoc('Get all hostels', 'GET', '/api/hostels'),
  routeDoc('Get hostel by slug', 'GET', '/api/hostels/slug/:slug'),
  routeDoc('Get hostel by ID', 'GET', '/api/hostels/:id'),
  routeDoc('Create hostel review', 'POST', '/api/hostels/:id/reviews', 'Private'),
];

export default router;