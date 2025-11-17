import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import hostelRoutes from './routes/hostel.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import maintenanceRoutes from './routes/maintenance.routes.js';
import userRoutes from './routes/user.routes.js';
import reviewRoutes from './routes/review.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import communicationRoutes from './routes/communication.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import custodianRoutes from './routes/custodian.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import messageRoutes from './routes/message.routes.js';
import healthRoutes from './routes/health.routes.js';
import { globalErrorHandler } from './utils/errorHandler.js';
import requestLogger from './middleware/requestLogger.js';
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Request logging middleware
app.use(requestLogger);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
})); // Enable Cross-Origin Resource Sharing
app.use(express.json({ limit: '50mb' })); // To parse JSON bodies with increased limit for images
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// A simple test route
app.get('/', (req, res) => {
  res.send('Hostel Booking System API is running...');
});

// Test endpoint for frontend connectivity
app.get('/api/test', (req, res) => {
  res.json({ message: 'API connection successful', timestamp: new Date().toISOString() });
});

// Debug endpoint to check bookings
app.get('/api/debug/bookings', async (req, res) => {
  try {
    logger.info('Debug endpoint accessed: /api/debug/bookings');
    const Booking = (await import('./models/booking.model.js')).default;
    const allBookings = await Booking.find({}).populate('student', 'name email');
    logger.info('Bookings retrieved successfully', { count: allBookings.length });
    res.json({
      total: allBookings.length,
      bookings: allBookings
    });
  } catch (error) {
    logger.error('Error in debug bookings endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/custodian', custodianRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', healthRoutes);

// Global error handler
app.use(globalErrorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`, {
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});
