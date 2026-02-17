import express from 'express';
import {
    getAllSessions,
    getActiveSession,
    createSession,
    setActiveSession,
    lockSemester,
    unlockSemester
} from '../controllers/sessionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';
import {
    createSessionValidation,
    mongoIdValidation
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllSessions);
router.get('/active', protect, getActiveSession);
router.post('/', protect, requireAdmin, createSessionValidation, createSession);
router.put('/:id/activate', protect, requireAdmin, mongoIdValidation, setActiveSession);
router.put('/:id/lock-semester', protect, requireAdmin, mongoIdValidation, lockSemester);
router.put('/:id/unlock-semester', protect, requireAdmin, mongoIdValidation, unlockSemester);

export default router;
