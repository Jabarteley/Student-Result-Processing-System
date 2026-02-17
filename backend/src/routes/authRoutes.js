import express from 'express';
import {
    register,
    login,
    getProfile,
    updateProfile,
    logout
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
    registerValidation,
    loginValidation
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

export default router;
