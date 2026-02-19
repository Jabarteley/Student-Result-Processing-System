import express from 'express';
import multer from 'multer';
import {
    uploadScore,
    bulkUploadScores,
    submitResults,
    approveResults,
    getResultsByStudent,
    getResultsByCourse,
    getMyResults,
    getResults,
    bulkUpdateResults,
    publishResults,
    overrideGrade
} from '../controllers/resultController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin, requireLecturer } from '../middleware/roleMiddleware.js';
import {
    uploadScoreValidation,
    mongoIdValidation
} from '../middleware/validationMiddleware.js';

const router = express.Router();

// Configure multer for CSV upload
const upload = multer({ dest: 'uploads/' });

router.post('/upload', protect, requireLecturer, uploadScoreValidation, uploadScore);
router.post('/bulk-upload', protect, requireLecturer, upload.single('file'), bulkUploadScores);
router.post('/submit', protect, requireLecturer, submitResults);
router.post('/approve', protect, requireAdmin, approveResults);
router.get('/student/:studentId', protect, mongoIdValidation, getResultsByStudent);
router.get('/my-results', protect, getMyResults);
router.get('/course/:courseId', protect, requireLecturer, mongoIdValidation, getResultsByCourse);
router.get('/', protect, getResults);
router.post('/bulk-update', protect, requireLecturer, bulkUpdateResults);
router.post('/publish', protect, requireAdmin, publishResults);
router.post('/override-grade', protect, requireAdmin, overrideGrade);

export default router;
