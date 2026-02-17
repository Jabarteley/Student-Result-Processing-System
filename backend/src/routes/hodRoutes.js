import express from 'express';
import {
    getHODDashboard,
    getPendingApprovals,
    approveResults,
    rejectResults,
    getDepartmentReport,
    getDepartmentLecturers
} from '../controllers/hodController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require HOD authentication
router.use(protect, authorize('hod', 'admin'));

router.get('/dashboard', getHODDashboard);
router.get('/pending-approvals', getPendingApprovals);
router.post('/approve', approveResults);
router.post('/reject', rejectResults);
router.get('/department-report', getDepartmentReport);
router.get('/lecturers', getDepartmentLecturers);

export default router;
