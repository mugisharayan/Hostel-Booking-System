import express from 'express';
import { createMaintenanceRequest, getMyMaintenanceRequests } from '../controllers/maintenance.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/').post(protect, createMaintenanceRequest);
router.route('/my-requests').get(protect, getMyMaintenanceRequests);

export default router;