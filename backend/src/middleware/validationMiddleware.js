import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
};

/**
 * Validation rules for user registration
 */
export const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['admin', 'lecturer', 'student']).withMessage('Invalid role'),
    body('department').optional().trim(),
    validate
];

/**
 * Validation rules for login
 */
export const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

/**
 * Validation rules for creating student
 */
export const createStudentValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('faculty').trim().notEmpty().withMessage('Faculty is required'),
    body('level').isIn([100, 200, 300, 400, 500]).withMessage('Invalid level'),
    body('sessionAdmitted').trim().notEmpty().withMessage('Session admitted is required'),
    body('admissionYear').isInt({ min: 2000, max: 2100 }).withMessage('Invalid admission year'),
    validate
];

/**
 * Validation rules for creating course
 */
export const createCourseValidation = [
    body('courseCode').trim().notEmpty().withMessage('Course code is required'),
    body('title').trim().notEmpty().withMessage('Course title is required'),
    body('creditUnit').isInt({ min: 1, max: 6 }).withMessage('Credit unit must be between 1 and 6'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('level').isIn([100, 200, 300, 400, 500]).withMessage('Invalid level'),
    body('semester').isIn(['First', 'Second']).withMessage('Invalid semester'),
    validate
];

/**
 * Validation rules for uploading score
 */
export const uploadScoreValidation = [
    body('studentId').isMongoId().withMessage('Invalid student ID'),
    body('courseId').isMongoId().withMessage('Invalid course ID'),
    body('session').trim().notEmpty().withMessage('Session is required'),
    body('semester').isIn(['First', 'Second']).withMessage('Invalid semester'),
    body('CA').isFloat({ min: 0, max: 30 }).withMessage('CA must be between 0 and 30'),
    body('exam').isFloat({ min: 0, max: 70 }).withMessage('Exam score must be between 0 and 70'),
    validate
];

/**
 * Validation rules for creating session
 */
export const createSessionValidation = [
    body('name').trim().notEmpty().withMessage('Session name is required'),
    body('startDate').isISO8601().withMessage('Invalid start date'),
    body('endDate').isISO8601().withMessage('Invalid end date'),
    validate
];

/**
 * Validation rules for MongoDB ObjectId
 */
export const mongoIdValidation = [
    param('id').isMongoId().withMessage('Invalid ID'),
    validate
];
