import express from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Routes
router.get('/', protect, requireAdmin, getAuditLogs);

export default router;
