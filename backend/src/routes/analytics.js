import express from 'express';
import { getMoodTrends, getSleepStats, getActivityImpact, getWellbeingInsights } from '../controllers/analyticsController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/mood-trends', getMoodTrends);
router.get('/sleep-stats', getSleepStats);
router.get('/activity-impact', getActivityImpact);
router.get('/wellbeing', getWellbeingInsights);

export default router;