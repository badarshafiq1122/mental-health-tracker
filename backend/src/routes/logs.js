import express from 'express';
import { validateLog } from '../middleware/validation.js';
import {
  createOrUpdateLog,
  getLogs,
  getLogById,
  updateLog,
  deleteLog
} from '../controllers/logsController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', validateLog, createOrUpdateLog);
router.get('/', getLogs);
router.get('/:id', getLogById);
router.put('/:id', validateLog, updateLog);
router.delete('/:id', deleteLog);

export default router;
