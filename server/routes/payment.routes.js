import { 
  createPaymentForBooking, 
  getPaymentByTransaction 
} from '../controllers/payment.controller.js';
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
const validateBookingId = validateRouteParams({
  bookingId: validateObjectId
});

const validateTransactionId = validateRouteParams({
  transactionId: (transactionId) => transactionId && transactionId.length > 0
});

// All payment routes require authentication
router.use(protect);

// Payment operations
router.route('/booking/:bookingId')
  .post(validateBookingId, createPaymentForBooking); // Create payment for booking

router.route('/transaction/:transactionId')
  .get(validateTransactionId, getPaymentByTransaction); // Get payment by transaction ID

// Route documentation
export const paymentRoutesDocs = [
  routeDoc('Create payment for booking', 'POST', '/api/payments/booking/:bookingId', 'Private'),
  routeDoc('Get payment by transaction ID', 'GET', '/api/payments/transaction/:transactionId', 'Private'),
];

export default router;