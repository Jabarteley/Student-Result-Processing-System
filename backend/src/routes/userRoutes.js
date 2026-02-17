import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetPassword,
    deactivateUser,
    activateUser
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect, requireAdmin);

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/:id/reset-password', resetPassword);
router.put('/:id/deactivate', deactivateUser);
router.put('/:id/activate', activateUser);

export default router;
