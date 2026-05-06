import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    message: dbStatus === 'connected' ? 'All systems operational' : 'Running in fallback mode'
  });
});

// Test endpoint that works without database
router.get('/test', (req, res) => {
  res.json({
    message: 'Server is working!',
    timestamp: new Date().toISOString()
  });
});

export default router;