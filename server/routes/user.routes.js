import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  debugUsers,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  createRouter,
  createPublicRoute,
  protectedRoutes,
  routeDoc
} from '../utils/route.helpers.js';

const router = createRouter();

// Public routes
createPublicRoute(router, 'post', '/register', registerUser);
createPublicRoute(router, 'post', '/login', loginUser);
createPublicRoute(router, 'post', '/logout', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Logged out successfully' 
  });
});

// Protected routes
router
  .route('/profile')
  .get(...protectedRoutes(protect), getUserProfile)
  .put(...protectedRoutes(protect), updateUserProfile);

router.put('/change-password', ...protectedRoutes(protect), changePassword);

// Development/Debug routes (should be removed in production)
if (process.env.NODE_ENV === 'development') {
  router.get('/debug', debugUsers);
}

// Route documentation (for API docs)
export const userRoutesDocs = [
  routeDoc('Register a new user', 'POST', '/api/users/register'),
  routeDoc('Login user', 'POST', '/api/users/login'),
  routeDoc('Logout user', 'POST', '/api/users/logout'),
  routeDoc('Get user profile', 'GET', '/api/users/profile', 'Private'),
  routeDoc('Update user profile', 'PUT', '/api/users/profile', 'Private'),
  routeDoc('Change password', 'PUT', '/api/users/change-password', 'Private'),
];

export default router;
