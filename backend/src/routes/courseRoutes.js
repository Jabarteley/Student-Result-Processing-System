import express from 'express';
import {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getCoursesByLecturer,
    assignLecturer
} from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';
import {
    createCourseValidation,
    mongoIdValidation
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllCourses);
router.get('/:id', protect, mongoIdValidation, getCourseById);
router.post('/', protect, requireAdmin, createCourseValidation, createCourse);
router.put('/:id', protect, requireAdmin, mongoIdValidation, updateCourse);
router.delete('/:id', protect, requireAdmin, mongoIdValidation, deleteCourse);
router.get('/lecturer/:lecturerId', protect, mongoIdValidation, getCoursesByLecturer);
router.put('/:id/assign-lecturer', protect, requireAdmin, mongoIdValidation, assignLecturer);

export default router;
