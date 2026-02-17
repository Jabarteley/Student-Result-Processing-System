import Student from '../models/Student.js';
import User from '../models/User.js';
import { logAction } from '../utils/auditLogger.js';
import { getAllStudentGPAs } from '../utils/gpaCalculator.js';

/**
 * @desc    Get all students
 * @route   GET /api/students
 * @access  Private (Admin, Lecturer)
 */
export const getAllStudents = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search,
            department,
            level,
            status,
            faculty
        } = req.query;

        // Build query
        const query = {};

        if (department) query.department = department;
        if (level) query.level = parseInt(level);
        if (status) query.status = status;
        if (faculty) query.faculty = faculty;

        // Search by name or matric number
        if (search) {
            const users = await User.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ],
                role: 'student'
            }).select('_id');

            const userIds = users.map(u => u._id);

            query.$or = [
                { userId: { $in: userIds } },
                { matricNumber: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const skip = (page - 1) * limit;

        const [students, total] = await Promise.all([
            Student.find(query)
                .populate('userId', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Student.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            data: students,
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
 * @desc    Get single student
 * @route   GET /api/students/:id
 * @access  Private
 */
export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate('userId', 'name email');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Get GPA records
        const gpaRecords = await getAllStudentGPAs(student._id);

        res.status(200).json({
            success: true,
            data: {
                ...student.toObject(),
                gpaRecords
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
 * @desc    Create new student
 * @route   POST /api/students
 * @access  Private (Admin only)
 */
export const createStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            department,
            faculty,
            level,
            sessionAdmitted,
            admissionYear,
            phoneNumber,
            address,
            dateOfBirth,
            gender
        } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user account
        const user = await User.create({
            name,
            email,
            password: password || 'student123', // Default password
            role: 'student',
            department,
            faculty
        });

        // Generate matric number
        const matricNumber = await Student.generateMatricNumber(department, admissionYear);

        // Create student profile
        const student = await Student.create({
            userId: user._id,
            matricNumber,
            department,
            faculty,
            level,
            sessionAdmitted,
            admissionYear,
            phoneNumber,
            address,
            dateOfBirth,
            gender,
            status: 'active'
        });

        // Log action
        await logAction({
            userId: req.user._id,
            action: 'CREATE',
            resource: 'Student',
            resourceId: student._id,
            description: `Created student: ${matricNumber}`
        });

        const populatedStudent = await Student.findById(student._id)
            .populate('userId', 'name email');

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: populatedStudent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Update student
 * @route   PUT /api/students/:id
 * @access  Private (Admin only)
 */
export const updateStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            department,
            faculty,
            level,
            status,
            phoneNumber,
            address,
            dateOfBirth,
            gender
        } = req.body;

        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Update user details
        if (name || email || department || faculty) {
            await User.findByIdAndUpdate(
                student.userId,
                { name, email, department, faculty },
                { runValidators: true }
            );
        }

        // Update student details
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            {
                department,
                faculty,
                level,
                status,
                phoneNumber,
                address,
                dateOfBirth,
                gender
            },
            { new: true, runValidators: true }
        ).populate('userId', 'name email');

        // Log action
        await logAction({
            userId: req.user._id,
            action: 'UPDATE',
            resource: 'Student',
            resourceId: student._id,
            changes: req.body,
            description: `Updated student: ${student.matricNumber}`
        });

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: updatedStudent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Delete student
 * @route   DELETE /api/students/:id
 * @access  Private (Admin only)
 */
export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Soft delete - set status to withdrawn
        student.status = 'withdrawn';
        await student.save();

        // Deactivate user account
        await User.findByIdAndUpdate(student.userId, { isActive: false });

        // Log action
        await logAction({
            userId: req.user._id,
            action: 'DELETE',
            resource: 'Student',
            resourceId: student._id,
            description: `Deleted student: ${student.matricNumber}`
        });

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
