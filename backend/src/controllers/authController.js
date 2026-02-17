import User from '../models/User.js';
import Student from '../models/Student.js';
import { generateToken } from '../middleware/authMiddleware.js';
import { logAction } from '../utils/auditLogger.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public (or Admin only, depending on requirements)
 */
export const register = async (req, res) => {
    try {
        const { name, email, password, role, department, faculty } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            department,
            faculty
        });

        // If role is student, create student profile
        if (role === 'student') {
            const currentYear = new Date().getFullYear();
            const matricNumber = await Student.generateMatricNumber(department, currentYear);

            await Student.create({
                userId: user._id,
                matricNumber,
                department,
                faculty,
                level: 100, // Default level for new students
                sessionAdmitted: `${currentYear}/${currentYear + 1}`,
                admissionYear: currentYear,
                status: 'active'
            });
        }

        // Log action
        await logAction({
            userId: user._id,
            action: 'CREATE',
            resource: 'User',
            resourceId: user._id,
            description: `User registered with role: ${role}`
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Your account has been deactivated. Please contact admin.'
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Log action
        await logAction({
            userId: user._id,
            action: 'LOGIN',
            resource: 'System',
            description: 'User logged in',
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        let profile = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            faculty: user.faculty,
            isActive: user.isActive
        };

        // If student, include student details
        if (user.role === 'student') {
            const student = await Student.findOne({ userId: user._id });
            if (student) {
                profile.studentDetails = student;
            }
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
    try {
        const { name, department, faculty } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, department, faculty },
            { new: true, runValidators: true }
        );

        // Log action
        await logAction({
            userId: req.user._id,
            action: 'UPDATE',
            resource: 'User',
            resourceId: user._id,
            changes: { name, department, faculty },
            description: 'User updated profile'
        });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
    try {
        // Log action
        await logAction({
            userId: req.user._id,
            action: 'LOGOUT',
            resource: 'System',
            description: 'User logged out'
        });

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
