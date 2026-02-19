import Result from '../models/Result.js';
import Course from '../models/Course.js';
import Student from '../models/Student.js';
import Session from '../models/Session.js';
import { logAction } from '../utils/auditLogger.js';
import { computeAndSaveGPA, getStudentGPA } from '../utils/gpaCalculator.js';
import { calculateGrade } from '../utils/gradeCalculator.js';
import csv from 'csv-parser';
import fs from 'fs';

/**
 * @desc    Upload single score
 * @route   POST /api/results/upload
 * @access  Private (Lecturer, Admin)
 */
export const uploadScore = async (req, res) => {
    try {
        const { studentId, courseId, session, semester, CA, exam, remarks } = req.body;

        // Verify student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Verify course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if semester is locked
        const academicSession = await Session.findOne({ name: session });
        if (academicSession && academicSession.isSemesterLocked(semester)) {
            return res.status(400).json({
                success: false,
                message: 'This semester is locked. Scores cannot be uploaded or edited.'
            });
        }

        // Check if result already exists
        let result = await Result.findOne({ studentId, courseId, session, semester });

        if (result) {
            // Update existing result
            if (result.status === 'approved') {
                return res.status(400).json({
                    success: false,
                    message: 'This result has been approved and cannot be edited'
                });
            }

            result.CA = CA;
            result.exam = exam;
            result.remarks = remarks;
            result.submittedBy = req.user._id;
            await result.save();

            await logAction({
                userId: req.user._id,
                action: 'UPDATE',
                resource: 'Result',
                resourceId: result._id,
                changes: { CA, exam },
                description: `Updated score for student ${student.matricNumber}`
            });
        } else {
            // Create new result
            result = await Result.create({
                studentId,
                courseId,
                session,
                semester,
                CA,
                exam,
                remarks,
                submittedBy: req.user._id,
                status: 'draft'
            });

            await logAction({
                userId: req.user._id,
                action: 'UPLOAD_SCORE',
                resource: 'Result',
                resourceId: result._id,
                description: `Uploaded score for student ${student.matricNumber}`
            });
        }

        const populatedResult = await Result.findById(result._id)
            .populate('studentId', 'matricNumber')
            .populate('courseId', 'courseCode title creditUnit')
            .populate('submittedBy', 'name');

        res.status(201).json({
            success: true,
            message: 'Score uploaded successfully',
            data: populatedResult
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Bulk upload scores via CSV
 * @route   POST /api/results/bulk-upload
 * @access  Private (Lecturer, Admin)
 */
export const bulkUploadScores = async (req, res) => {
    try {
        const { courseId, session, semester } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a CSV file'
            });
        }

        // Verify course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if semester is locked
        const academicSession = await Session.findOne({ name: session });
        if (academicSession && academicSession.isSemesterLocked(semester)) {
            return res.status(400).json({
                success: false,
                message: 'This semester is locked. Scores cannot be uploaded.'
            });
        }

        const results = [];
        const errors = [];

        // Parse CSV
        fs.createReadStream(file.path)
            .pipe(csv())
            .on('data', async (row) => {
                try {
                    const { matricNumber, CA, exam } = row;

                    // Find student by matric number
                    const student = await Student.findOne({ matricNumber: matricNumber.trim().toUpperCase() });

                    if (!student) {
                        errors.push({ matricNumber, error: 'Student not found' });
                        return;
                    }

                    // Validate scores
                    const caScore = parseFloat(CA);
                    const examScore = parseFloat(exam);

                    if (isNaN(caScore) || caScore < 0 || caScore > 30) {
                        errors.push({ matricNumber, error: 'Invalid CA score' });
                        return;
                    }

                    if (isNaN(examScore) || examScore < 0 || examScore > 70) {
                        errors.push({ matricNumber, error: 'Invalid exam score' });
                        return;
                    }

                    // Create or update result
                    const result = await Result.findOneAndUpdate(
                        { studentId: student._id, courseId, session, semester },
                        {
                            CA: caScore,
                            exam: examScore,
                            submittedBy: req.user._id,
                            status: 'draft'
                        },
                        { upsert: true, new: true }
                    );

                    results.push(result);
                } catch (err) {
                    errors.push({ matricNumber: row.matricNumber, error: err.message });
                }
            })
            .on('end', async () => {
                // Delete uploaded file
                fs.unlinkSync(file.path);

                await logAction({
                    userId: req.user._id,
                    action: 'UPLOAD_SCORE',
                    resource: 'Result',
                    description: `Bulk uploaded ${results.length} scores for course ${course.courseCode}`
                });

                res.status(201).json({
                    success: true,
                    message: 'Bulk upload completed',
                    data: {
                        uploaded: results.length,
                        errors: errors.length,
                        errorDetails: errors
                    }
                });
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Submit results for approval
 * @route   POST /api/results/submit
 * @access  Private (Lecturer)
 */
export const submitResults = async (req, res) => {
    try {
        const { courseId, session, semester } = req.body;

        // Update all draft results for this course/session/semester
        const updateResult = await Result.updateMany(
            {
                courseId,
                session,
                semester,
                status: 'draft',
                submittedBy: req.user._id
            },
            {
                status: 'submitted',
                submittedAt: new Date()
            }
        );

        await logAction({
            userId: req.user._id,
            action: 'SUBMIT_RESULT',
            resource: 'Result',
            description: `Submitted ${updateResult.modifiedCount} results for approval`
        });

        res.status(200).json({
            success: true,
            message: `${updateResult.modifiedCount} results submitted for approval`,
            data: { count: updateResult.modifiedCount }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Approve results
 * @route   POST /api/results/approve
 * @access  Private (Admin, HOD)
 */
export const approveResults = async (req, res) => {
    try {
        const { courseId, session, semester } = req.body;

        // Update all submitted results
        const updateResult = await Result.updateMany(
            {
                courseId,
                session,
                semester,
                status: 'submitted'
            },
            {
                status: 'approved',
                approvedBy: req.user._id,
                approvedAt: new Date()
            }
        );

        // Compute GPA for all affected students
        const results = await Result.find({ courseId, session, semester, status: 'approved' });
        const studentIds = [...new Set(results.map(r => r.studentId.toString()))];

        for (const studentId of studentIds) {
            await computeAndSaveGPA(studentId, session, semester);
        }

        await logAction({
            userId: req.user._id,
            action: 'APPROVE_RESULT',
            resource: 'Result',
            description: `Approved ${updateResult.modifiedCount} results`
        });

        res.status(200).json({
            success: true,
            message: `${updateResult.modifiedCount} results approved`,
            data: { count: updateResult.modifiedCount }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Get results by student
 * @route   GET /api/results/student/:studentId
 * @access  Private
 */
export const getResultsByStudent = async (req, res) => {
    try {
        const { session, semester } = req.query;

        const query = { studentId: req.params.studentId, status: 'approved' };
        if (session) query.session = session;
        if (semester) query.semester = semester;

        const results = await Result.find(query)
            .populate('courseId', 'courseCode title creditUnit')
            .sort({ session: -1, semester: -1 });

        // Get GPA if session and semester provided
        let gpaData = null;
        if (session && semester) {
            gpaData = await getStudentGPA(req.params.studentId, session, semester);
        }

        res.status(200).json({
            success: true,
            data: {
                results,
                gpa: gpaData
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
 * @desc    Get results by course
 * @route   GET /api/results/course/:courseId
 * @access  Private (Lecturer, Admin)
 */
export const getResultsByCourse = async (req, res) => {
    try {
        const { session, semester } = req.query;

        const query = { courseId: req.params.courseId };
        if (session) query.session = session;
        if (semester) query.semester = semester;

        const results = await Result.find(query)
            .populate('studentId')
            .populate({
                path: 'studentId',
                populate: { path: 'userId', select: 'name email' }
            })
            .sort({ total: -1 });

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Get logged in student's results
 * @route   GET /api/results/my-results
 * @access  Private (Student)
 */
export const getMyResults = async (req, res) => {
    try {
        const { session, semester } = req.query;

        // Find the student profile for the logged in user
        const student = await Student.findOne({ userId: req.user._id });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        const query = { studentId: student._id, status: 'approved' };
        if (session) query.session = session;
        if (semester) query.semester = semester;

        const results = await Result.find(query)
            .populate('courseId', 'courseCode title creditUnit')
            .sort({ session: -1, semester: -1 });

        // Get GPA if session and semester provided
        let gpaData = null;
        if (session && semester) {
            gpaData = await getStudentGPA(student._id, session, semester);
        }

        res.status(200).json({
            success: true,
            data: {
                results,
                gpa: gpaData
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
 * @desc    Get all results with filters
 * @route   GET /api/results
 * @access  Private
 */
export const getResults = async (req, res) => {
    try {
        const { courseId, studentId, session, semester, status } = req.query;
        const query = {};

        if (courseId) query.courseId = courseId;
        if (studentId) query.studentId = studentId;
        if (session) query.session = session;
        if (semester) query.semester = semester;
        if (status) query.status = status;

        const results = await Result.find(query)
            .populate({
                path: 'studentId',
                populate: { path: 'userId', select: 'name email' }
            })
            .populate('courseId', 'courseCode title creditUnit')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Bulk update scores
 * @route   POST /api/results/bulk-update
 * @access  Private (Lecturer, Admin)
 */
export const bulkUpdateResults = async (req, res) => {
    try {
        const { courseId, scores, submit, session, semester } = req.body;

        if (!courseId || !scores || !Array.isArray(scores)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide courseId and scores array'
            });
        }

        const updatedResults = [];
        const errors = [];

        for (const item of scores) {
            try {
                const { studentId, caScore, examScore } = item;

                // Calculate derived fields
                const total = caScore + examScore;
                const gradeInfo = calculateGrade(total);

                // Build update object
                const updateData = {
                    CA: caScore,
                    exam: examScore,
                    total: total,
                    grade: gradeInfo.grade,
                    gradePoint: gradeInfo.point,
                    updatedBy: req.user._id
                };

                if (submit) {
                    updateData.status = 'submitted';
                    updateData.submittedAt = new Date();
                    updateData.submittedBy = req.user._id;
                }

                // If session/semester provided, use them for upsert
                // Otherwise try to find existing result
                let result;
                if (session && semester) {
                    result = await Result.findOneAndUpdate(
                        { studentId, courseId, session, semester },
                        updateData,
                        { upsert: true, new: true }
                    );
                } else {
                    // Try to update the most recent one if no session/semester provided
                    result = await Result.findOneAndUpdate(
                        { studentId, courseId },
                        updateData,
                        { sort: { createdAt: -1 }, new: true }
                    );
                }

                if (result) {
                    updatedResults.push(result);
                }
            } catch (err) {
                errors.push({ studentId: item.studentId, error: err.message });
            }
        }

        await logAction({
            userId: req.user._id,
            action: submit ? 'SUBMIT_RESULT' : 'UPDATE_RESULT',
            resource: 'Result',
            description: `Bulk ${submit ? 'submitted' : 'updated'} ${updatedResults.length} scores for course ${courseId}`
        });

        res.status(200).json({
            success: true,
            message: `Successfully processed ${updatedResults.length} records`,
            data: {
                processed: updatedResults.length,
                failed: errors.length,
                errors
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
