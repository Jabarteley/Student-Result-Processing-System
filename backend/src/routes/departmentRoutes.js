import express from 'express';
import {
    getAllDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from '../controllers/departmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';
import { mongoIdValidation } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllDepartments);
router.get('/:id', protect, mongoIdValidation, getDepartment);
router.post('/', protect, requireAdmin, createDepartment);
router.put('/:id', protect, requireAdmin, mongoIdValidation, updateDepartment);
router.delete('/:id', protect, requireAdmin, mongoIdValidation, deleteDepartment);

export default router;
