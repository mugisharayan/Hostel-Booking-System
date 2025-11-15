import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  createRouter,
  protectedRoutes,
  validateRouteParams,
  routeDoc
} from '../utils/route.helpers.js';
import { validateObjectId } from '../utils/validation.js';

const router = createRouter();

// Validation middleware for booking ID
const validateBookingId = validateRouteParams({
  id: validateObjectId
});

// All booking routes require authentication
router.use(protect);

// Booking CRUD operations
router.route('/')
  .post(createBooking); // Create new booking

router.route('/my-bookings')
  .get(getMyBookings); // Get user's bookings

router.route('/:id/cancel')
  .put(validateBookingId, cancelBooking); // Cancel specific booking

// Route documentation
export const bookingRoutesDocs = [
  routeDoc('Create a new booking', 'POST', '/api/bookings', 'Private'),
  routeDoc('Get user bookings', 'GET', '/api/bookings/my-bookings', 'Private'),
  routeDoc('Cancel a booking', 'PUT', '/api/bookings/:id/cancel', 'Private'),
];

export default router;