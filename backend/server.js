const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import controllers
const { signupStudent } = require('./controllers/studentController');
const { getBookingDetails } = require('./controllers/bookingController');
const { initiatePayment } = require('./controllers/paymentController');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hostel-booking';

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
// API Routes should be defined before the static file serving and catch-all route.
app.post('/api/students/signup', signupStudent);
app.get('/api/bookings/:bookingId', getBookingDetails);
app.post('/api/payments/initiate', initiatePayment);


const buildPath = path.resolve(__dirname, '../client/build');


app.use(express.static(buildPath));


app.get(/.*/, (req, res) => {

app.get('*', (req, res) => {
  console.log('Serving React app from:', path.join(buildPath, 'index.html'));

  res.sendFile(path.join(buildPath, 'index.html'));
});


app.listen(PORT, () => {
  console.log(`✅ Server runpm ning at: http://localhost:${PORT}`);
});


})

