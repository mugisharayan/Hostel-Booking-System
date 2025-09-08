const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { signupStudent } = require('./controllers/studentController');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure allowed frontend origin(s)
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN, // e.g. http://localhost:3000 or http://localhost:5173
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (like curl/postman) with no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  // Let cors package handle default methods; include legacy success status for OPTIONS
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// CORS for all routes
app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel-booking')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.post('/api/students/signup', (req, res, next) => {
  console.log('Received signup request:', req.body);
  next();
}, signupStudent);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/api/test`);
});
