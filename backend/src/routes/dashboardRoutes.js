import express from 'express';
import {
    getAdminDashboard,
    getLecturerDashboard,
    getStudentDashboard,
    getHODDashboard
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/admin', protect, authorize('admin'), getAdminDashboard);
router.get('/lecturer', protect, authorize('lecturer'), getLecturerDashboard);
router.get('/student', protect, authorize('student'), getStudentDashboard);
router.get('/hod', protect, authorize('hod'), getHODDashboard);

export default router;
