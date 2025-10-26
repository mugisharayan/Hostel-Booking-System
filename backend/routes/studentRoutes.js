const express = require('express');
const router = express.Router();
const { getStudentDashboardData } = require('../controllers/studentController');

// Assuming you have middleware for authentication and role checks
// const { protect, isStudent } = require('../middleware/authMiddleware');

// This single endpoint will provide all data needed for the student dashboard
router.get('/dashboard', /* protect, isStudent, */ getStudentDashboardData);

module.exports = router;