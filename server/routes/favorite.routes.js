import express from 'express';
import { getMyFavorites, addFavorite, removeFavorite } from '../controllers/favorite.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getMyFavorites);
router.post('/:hostelId', protect, addFavorite);
router.delete('/:hostelId', protect, removeFavorite);

export default router;
