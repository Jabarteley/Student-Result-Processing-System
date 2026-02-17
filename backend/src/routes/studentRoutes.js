import express from 'express';
import {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
} from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin, requireLecturer } from '../middleware/roleMiddleware.js';
import {
    createStudentValidation,
    mongoIdValidation
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', protect, requireLecturer, getAllStudents);
router.get('/:id', protect, mongoIdValidation, getStudentById);
router.post('/', protect, requireAdmin, createStudentValidation, createStudent);
router.put('/:id', protect, requireAdmin, mongoIdValidation, updateStudent);
router.delete('/:id', protect, requireAdmin, mongoIdValidation, deleteStudent);

export default router;
