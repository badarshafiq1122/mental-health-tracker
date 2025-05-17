import express from 'express';
import { exportLogsAsJSON, exportLogsAsCSV } from '../controllers/exportController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/json', exportLogsAsJSON);
router.get('/csv', exportLogsAsCSV);

export default router;