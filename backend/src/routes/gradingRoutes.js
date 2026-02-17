import express from 'express';
import {
    getAllGradingScales,
    createGradingScale,
    updateGradingScale,
    deleteGradingScale,
    initializeDefaultGrading
} from '../controllers/gradingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public route to get grading scales
router.get('/', getAllGradingScales);

// Admin-only routes
router.post('/', protect, requireAdmin, createGradingScale);
router.put('/:id', protect, requireAdmin, updateGradingScale);
router.delete('/:id', protect, requireAdmin, deleteGradingScale);
router.post('/initialize', protect, requireAdmin, initializeDefaultGrading);

export default router;
