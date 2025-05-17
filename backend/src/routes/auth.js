import express from 'express';
import { googleSignIn, getCurrentUser, googleCallback } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/google', authLimiter, googleSignIn);
router.get('/google/callback', googleCallback);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
