import Result from '../models/Result.js';
import Course from '../models/Course.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import SystemSettings from '../models/SystemSettings.js';
import { logAction } from '../utils/auditLogger.js';
import { calculateGrade } from '../utils/gradeCalculator.js';

// Get HOD dashboard data
export const getHODDashboard = async (req, res) => {
    try {
        const hodDepartment = req.user.department;

        // Get pending approvals count
        const pendingApprovals = await Result.countDocuments({
            status: 'submitted'
        }).populate({
            path: 'courseId',
            match: { department: hodDepartment }
        });

        // Get total students in department
        const totalStudents = await Student.countDocuments({
            department: hodDepartment,
            status: 'active'
        });

        // Get total courses in department
        const totalCourses = await Course.countDocuments({
            department: hodDepartment,
            isActive: true
        });

        // Get recent submissions
        const recentSubmissions = await Result.find({
            status: 'submitted'
        })
            .populate('studentId', 'matricNumber')
            .populate('courseId', 'courseCode title department')
            .populate('submittedBy', 'name')
            .sort({ submittedAt: -1 })
            .limit(10);

        // Filter by department and self-heal
        const departmentSubmissions = recentSubmissions
            .filter(result => result.courseId?.department === hodDepartment)
            .map(result => {
                const r = result.toObject();
                if (r.total === undefined || r.grade === undefined) {
                    r.total = (r.CA || 0) + (r.exam || 0);
                    const gradeInfo = calculateGrade(r.total);
                    r.grade = gradeInfo.grade;
                    r.gradePoint = gradeInfo.point;
                }
                return r;
            });

        res.json({
            success: true,
            data: {
                stats: {
                    pendingApprovals,
                    totalStudents,
                    totalCourses
                },
                recentSubmissions: departmentSubmissions
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching HOD dashboard',
            error: error.message
        });
    }
};

// Get pending approvals
export const getPendingApprovals = async (req, res) => {
    try {
        const hodDepartment = req.user.department;
        const { session, semester, courseId } = req.query;

        const query = { status: 'submitted' };
        if (session) query.session = session;
        if (semester) query.semester = semester;
        if (courseId) query.courseId = courseId;

        const results = await Result.find(query)
            .populate('studentId', 'matricNumber userId')
            .populate({
                path: 'studentId',
                populate: { path: 'userId', select: 'name' }
            })
            .populate('courseId', 'courseCode title department creditUnit')
            .populate('submittedBy', 'name')
            .sort({ submittedAt: -1 });

        // Filter by department and ensure scores/grades are calculated
        const departmentResults = results
            .filter(result => result.courseId?.department === hodDepartment)
            .map(result => {
                const r = result.toObject();
                // Self-healing: if total or grade is missing, calculate it
                if (r.total === undefined || r.grade === undefined) {
                    r.total = (r.CA || 0) + (r.exam || 0);
                    const gradeInfo = calculateGrade(r.total);
                    r.grade = gradeInfo.grade;
                    r.gradePoint = gradeInfo.point;
                }
                return r;
            });

        res.json({
            success: true,
            data: departmentResults
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching pending approvals',
            error: error.message
        });
    }
};

// Approve results
export const approveResults = async (req, res) => {
    try {
        const { resultIds, session, semester, courseId } = req.body;

        let query = {};
        if (resultIds && resultIds.length > 0) {
            query._id = { $in: resultIds };
        } else if (courseId && session && semester) {
            query = { courseId, session, semester, status: 'submitted' };
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please provide either resultIds or course/session/semester'
            });
        }

        const results = await Result.updateMany(query, {
            status: 'hod_approved',
            hodApprovedBy: req.user._id,
            hodApprovedAt: new Date()
        });

        // Log action
        await logAction({
            userId: req.user._id,
            action: 'HOD_APPROVE_RESULTS',
            resource: 'Result',
            details: `HOD approved ${results.modifiedCount} results`,
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.json({
            success: true,
            message: `${results.modifiedCount} results approved successfully`,
            data: { approvedCount: results.modifiedCount }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error approving results',
            error: error.message
        });
    }
};

// Reject results
export const rejectResults = async (req, res) => {
    try {
        const { resultIds, reason } = req.body;

        if (!resultIds || resultIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide result IDs'
            });
        }

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Please provide rejection reason'
            });
        }

        const results = await Result.updateMany(
            { _id: { $in: resultIds }, status: 'submitted' },
            {
                status: 'rejected',
                rejectionReason: reason,
                hodApprovedBy: req.user._id,
                hodApprovedAt: new Date()
            }
        );

        // Log action
        await logAction({
            userId: req.user._id,
            action: 'HOD_REJECT_RESULTS',
            resource: 'Result',
            details: `HOD rejected ${results.modifiedCount} results: ${reason}`,
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.json({
            success: true,
            message: `${results.modifiedCount} results rejected`,
            data: { rejectedCount: results.modifiedCount }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error rejecting results',
            error: error.message
        });
    }
};

// Get department report
export const getDepartmentReport = async (req, res) => {
    try {
        const hodDepartment = req.user.department;
        const { session, semester } = req.query;

        if (!session || !semester) {
            return res.status(400).json({
                success: false,
                message: 'Please provide session and semester'
            });
        }

        // Get all courses in department
        const courses = await Course.find({
            department: hodDepartment,
            isActive: true
        });

        const courseIds = courses.map(c => c._id);

        // Get all results for these courses
        const results = await Result.find({
            courseId: { $in: courseIds },
            session,
            semester,
            status: { $in: ['hod_approved', 'published'] }
        }).populate('courseId', 'courseCode title');

        // Calculate statistics
        const totalResults = results.length;
        const gradeDistribution = {};
        let totalGradePoints = 0;

        results.forEach(result => {
            gradeDistribution[result.grade] = (gradeDistribution[result.grade] || 0) + 1;
            totalGradePoints += result.gradePoint;
        });

        const averageGradePoint = totalResults > 0 ? (totalGradePoints / totalResults).toFixed(2) : 0;

        // Pass/Fail statistics
        const passCount = results.filter(r => r.grade !== 'F').length;
        const failCount = results.filter(r => r.grade === 'F').length;
        const passRate = totalResults > 0 ? ((passCount / totalResults) * 100).toFixed(2) : 0;

        res.json({
            success: true,
            data: {
                department: hodDepartment,
                session,
                semester,
                totalCourses: courses.length,
                totalResults,
                gradeDistribution,
                averageGradePoint,
                passCount,
                failCount,
                passRate: `${passRate}%`,
                courses: courses.map(course => ({
                    courseCode: course.courseCode,
                    title: course.title,
                    resultsCount: results.filter(r => r.courseId._id.toString() === course._id.toString()).length
                }))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating department report',
            error: error.message
        });
    }
};
// Get department lecturers
export const getDepartmentLecturers = async (req, res) => {
    try {
        const hodDepartment = req.user.department;

        // Find all users with role 'lecturer' in the same department
        const lecturers = await User.find({
            role: 'lecturer',
            department: hodDepartment,
            isActive: true
        }).select('name email phoneNumber faculty createdAt');

        // For each lecturer, get their assigned courses
        const lecturersWithCourses = await Promise.all(lecturers.map(async (lecturer) => {
            const courseCount = await Course.countDocuments({ lecturerId: lecturer._id, isActive: true });
            return {
                ...lecturer.toObject(),
                courseCount
            };
        }));

        res.json({
            success: true,
            data: lecturersWithCourses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching department lecturers',
            error: error.message
        });
    }
};
