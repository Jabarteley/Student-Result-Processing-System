import Course from '../models/Course.js';
import User from '../models/User.js';
import { logAction } from '../utils/auditLogger.js';

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 * @access  Private
 */
export const getAllCourses = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search,
            department,
            level,
            semester,
            lecturerId,
            faculty
        } = req.query;

        // Build query
        const query = { isActive: true };

        if (department) query.department = department;
        if (level) query.level = parseInt(level);
        if (semester) query.semester = semester;
        if (lecturerId) query.lecturerId = lecturerId;
        if (faculty) query.faculty = faculty;

        // Search by course code or title
        if (search) {
            query.$or = [
                { courseCode: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const skip = (page - 1) * limit;

        const [courses, total] = await Promise.all([
            Course.find(query)
                .populate('lecturerId', 'name email')
                .sort({ courseCode: 1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Course.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            data: courses,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
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
 * @desc    Get single course
 * @route   GET /api/courses/:id
 * @access  Private
 */
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('lecturerId', 'name email department');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Create new course
 * @route   POST /api/courses
 * @access  Private (Admin only)
 */
export const createCourse = async (req, res) => {
    try {
        const {
            courseCode,
            title,
            creditUnit,
            department,
            faculty,
            level,
            semester,
            lecturerId,
            description
        } = req.body;

        // Check if course code already exists
        const courseExists = await Course.findOne({ courseCode });
        if (courseExists) {
            return res.status(400).json({
                success: false,
                message: 'Course with this code already exists'
            });
        }

        // Verify lecturer exists if provided
        if (lecturerId) {
            const lecturer = await User.findOne({ _id: lecturerId, role: 'lecturer' });
            if (!lecturer) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid lecturer ID'
                });
            }
        }

        const course = await Course.create({
            courseCode,
            title,
            creditUnit,
            department,
            faculty,
            level,
            semester,
            lecturerId,
            description
        });

        // Log action
        await logAction({
            userId: req.user._id,
            action: 'CREATE',
            resource: 'Course',
            resourceId: course._id,
            description: `Created course: ${courseCode}`
        });

        const populatedCourse = await Course.findById(course._id)
            .populate('lecturerId', 'name email');

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: populatedCourse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Update course
 * @route   PUT /api/courses/:id
 * @access  Private (Admin only)
 */
export const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Verify lecturer if being updated
        if (req.body.lecturerId) {
            const lecturer = await User.findOne({ _id: req.body.lecturerId, role: 'lecturer' });
            if (!lecturer) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid lecturer ID'
                });
            }
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('lecturerId', 'name email');

        // Log action
        await logAction({
            userId: req.user._id,
            action: 'UPDATE',
            resource: 'Course',
            resourceId: course._id,
            changes: req.body,
            description: `Updated course: ${course.courseCode}`
        });

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: updatedCourse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Delete course
 * @route   DELETE /api/courses/:id
 * @access  Private (Admin only)
 */
export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Soft delete
        course.isActive = false;
        await course.save();

        // Log action
        await logAction({
            userId: req.user._id,
            action: 'DELETE',
            resource: 'Course',
            resourceId: course._id,
            description: `Deleted course: ${course.courseCode}`
        });

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Get courses by lecturer
 * @route   GET /api/courses/lecturer/:lecturerId
 * @access  Private
 */
export const getCoursesByLecturer = async (req, res) => {
    try {
        const courses = await Course.find({
            lecturerId: req.params.lecturerId,
            isActive: true
        }).sort({ courseCode: 1 });

        res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Assign lecturer to course
 * @route   PUT /api/courses/:id/assign-lecturer
 * @access  Private (Admin only)
 */
export const assignLecturer = async (req, res) => {
    try {
        const { lecturerId } = req.body;

        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Verify lecturer
        const lecturer = await User.findOne({ _id: lecturerId, role: 'lecturer' });
        if (!lecturer) {
            return res.status(400).json({
                success: false,
                message: 'Invalid lecturer ID'
            });
        }

        course.lecturerId = lecturerId;
        await course.save();

        // Log action
        await logAction({
            userId: req.user._id,
            action: 'UPDATE',
            resource: 'Course',
            resourceId: course._id,
            changes: { lecturerId },
            description: `Assigned lecturer to course: ${course.courseCode}`
        });

        const populatedCourse = await Course.findById(course._id)
            .populate('lecturerId', 'name email');

        res.status(200).json({
            success: true,
            message: 'Lecturer assigned successfully',
            data: populatedCourse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
