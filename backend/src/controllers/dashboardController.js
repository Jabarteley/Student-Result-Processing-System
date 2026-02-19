import Student from '../models/Student.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Result from '../models/Result.js';
import { getAllStudentGPAs } from '../utils/gpaCalculator.js';

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/dashboard/admin
 * @access  Private (Admin only)
 */
export const getAdminDashboard = async (req, res) => {
    try {
        const [
            totalStudents,
            activeStudents,
            totalLecturers,
            totalCourses,
            totalResults,
            recentStudents
        ] = await Promise.all([
            Student.countDocuments(),
            Student.countDocuments({ status: 'active' }),
            User.countDocuments({ role: 'lecturer', isActive: true }),
            Course.countDocuments({ isActive: true }),
            Result.countDocuments({ status: { $in: ['hod_approved', 'published'] } }),
            Student.find()
                .populate('userId', 'name email')
                .sort({ createdAt: -1 })
                .limit(5)
        ]);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalStudents,
                    activeStudents,
                    totalLecturers,
                    totalCourses,
                    totalResults
                },
                recentStudents
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
 * @desc    Get lecturer dashboard stats
 * @route   GET /api/dashboard/lecturer
 * @access  Private (Lecturer only)
 */
export const getLecturerDashboard = async (req, res) => {
    try {
        // Get courses assigned to this lecturer
        const courses = await Course.find({
            lecturerId: req.user._id,
            isActive: true
        });

        const courseIds = courses.map(c => c._id);

        // Get results statistics
        const [
            totalResultsUploaded,
            pendingApprovals,
            approvedResults
        ] = await Promise.all([
            Result.countDocuments({ courseId: { $in: courseIds } }),
            Result.countDocuments({ courseId: { $in: courseIds }, status: 'submitted' }),
            Result.countDocuments({ courseId: { $in: courseIds }, status: { $in: ['hod_approved', 'published'] } })
        ]);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    assignedCourses: courses.length,
                    totalResultsUploaded,
                    pendingApprovals,
                    approvedResults
                },
                courses
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
 * @desc    Get student dashboard stats
 * @route   GET /api/dashboard/student
 * @access  Private (Student only)
 */
export const getStudentDashboard = async (req, res) => {
    try {
        // Get student profile
        const student = await Student.findOne({ userId: req.user._id }).populate('userId', 'name email');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        // Get all GPA records
        const gpaRecords = await getAllStudentGPAs(student._id);

        // Get latest CGPA
        const latestGPA = gpaRecords.length > 0 ? gpaRecords[gpaRecords.length - 1] : null;

        // Get recent results
        const recentResults = await Result.find({
            studentId: student._id,
            status: { $in: ['hod_approved', 'published'] }
        })
            .populate('courseId', 'courseCode title creditUnit')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get total courses taken
        const totalCourses = await Result.countDocuments({
            studentId: student._id,
            status: { $in: ['hod_approved', 'published'] }
        });

        res.status(200).json({
            success: true,
            data: {
                student,
                stats: {
                    currentGPA: latestGPA ? latestGPA.GPA : 0,
                    currentCGPA: latestGPA ? latestGPA.CGPA : 0,
                    totalCourses,
                    totalCreditUnits: latestGPA ? latestGPA.cumulativeCreditUnits : 0
                },
                gpaRecords,
                recentResults
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
 * @desc    Get HOD dashboard stats
 * @route   GET /api/dashboard/hod
 * @access  Private (HOD only)
 */
export const getHODDashboard = async (req, res) => {
    try {
        const { department } = req.user;

        // Get recent results for approval
        const pendingResults = await Result.find({
            status: 'submitted'
        }).populate({
            path: 'courseId',
            match: { department } // Only courses from HOD's department
        });

        // Filter out results where courseId is null (mismatched department)
        const departmentPendingResults = pendingResults.filter(r => r.courseId);

        // Count students in department
        const studentCount = await Student.countDocuments({ department, status: 'active' });

        // Count courses in department
        const courseCount = await Course.countDocuments({ department, isActive: true });

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    pendingApprovals: departmentPendingResults.length,
                    courses: courseCount,
                    students: studentCount,
                    departmentName: department
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
