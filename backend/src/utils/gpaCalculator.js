import Result from '../models/Result.js';
import Course from '../models/Course.js';
import GPA from '../models/GPA.js';

/**
 * Calculate GPA for a specific semester
 * @param {ObjectId} studentId - Student ID
 * @param {String} session - Academic session (e.g., "2023/2024")
 * @param {String} semester - Semester ("First" or "Second")
 * @returns {Object} - { gpa, totalCreditUnits, totalQualityPoints }
 */
export const calculateSemesterGPA = async (studentId, session, semester) => {
    try {
        // Get all results for the student in this semester
        const results = await Result.find({
            studentId,
            session,
            semester,
            status: 'approved' // Only count approved results
        }).populate('courseId');

        if (results.length === 0) {
            return {
                gpa: 0,
                totalCreditUnits: 0,
                totalQualityPoints: 0
            };
        }

        let totalQualityPoints = 0;
        let totalCreditUnits = 0;

        results.forEach(result => {
            const creditUnit = result.courseId.creditUnit;
            const gradePoint = result.gradePoint;

            totalQualityPoints += gradePoint * creditUnit;
            totalCreditUnits += creditUnit;
        });

        const gpa = totalCreditUnits > 0 ? totalQualityPoints / totalCreditUnits : 0;

        return {
            gpa: parseFloat(gpa.toFixed(2)),
            totalCreditUnits,
            totalQualityPoints
        };
    } catch (error) {
        throw new Error(`Error calculating GPA: ${error.message}`);
    }
};

/**
 * Calculate CGPA (Cumulative GPA) for a student
 * @param {ObjectId} studentId - Student ID
 * @param {String} upToSession - Calculate up to this session (optional)
 * @param {String} upToSemester - Calculate up to this semester (optional)
 * @returns {Object} - { cgpa, cumulativeCreditUnits, cumulativeQualityPoints }
 */
export const calculateCGPA = async (studentId, upToSession = null, upToSemester = null) => {
    try {
        // Build query
        const query = {
            studentId,
            status: 'approved'
        };

        // Get all approved results for the student
        const results = await Result.find(query).populate('courseId');

        if (results.length === 0) {
            return {
                cgpa: 0,
                cumulativeCreditUnits: 0,
                cumulativeQualityPoints: 0
            };
        }

        let cumulativeQualityPoints = 0;
        let cumulativeCreditUnits = 0;

        results.forEach(result => {
            const creditUnit = result.courseId.creditUnit;
            const gradePoint = result.gradePoint;

            cumulativeQualityPoints += gradePoint * creditUnit;
            cumulativeCreditUnits += creditUnit;
        });

        const cgpa = cumulativeCreditUnits > 0 ? cumulativeQualityPoints / cumulativeCreditUnits : 0;

        return {
            cgpa: parseFloat(cgpa.toFixed(2)),
            cumulativeCreditUnits,
            cumulativeQualityPoints
        };
    } catch (error) {
        throw new Error(`Error calculating CGPA: ${error.message}`);
    }
};

/**
 * Calculate and save GPA/CGPA for a student's semester
 * @param {ObjectId} studentId - Student ID
 * @param {String} session - Academic session
 * @param {String} semester - Semester
 * @returns {Object} - Saved GPA document
 */
export const computeAndSaveGPA = async (studentId, session, semester) => {
    try {
        // Calculate semester GPA
        const semesterData = await calculateSemesterGPA(studentId, session, semester);

        // Calculate cumulative CGPA
        const cumulativeData = await calculateCGPA(studentId);

        // Update or create GPA record
        const gpaRecord = await GPA.findOneAndUpdate(
            { studentId, session, semester },
            {
                GPA: semesterData.gpa,
                CGPA: cumulativeData.cgpa,
                totalCreditUnits: semesterData.totalCreditUnits,
                totalQualityPoints: semesterData.totalQualityPoints,
                cumulativeCreditUnits: cumulativeData.cumulativeCreditUnits,
                cumulativeQualityPoints: cumulativeData.cumulativeQualityPoints,
                computedAt: new Date()
            },
            { new: true, upsert: true }
        );

        return gpaRecord;
    } catch (error) {
        throw new Error(`Error computing and saving GPA: ${error.message}`);
    }
};

/**
 * Get student's GPA/CGPA for a specific semester
 * @param {ObjectId} studentId - Student ID
 * @param {String} session - Academic session
 * @param {String} semester - Semester
 * @returns {Object} - GPA data
 */
export const getStudentGPA = async (studentId, session, semester) => {
    try {
        let gpaRecord = await GPA.findOne({ studentId, session, semester });

        // If not found, compute it
        if (!gpaRecord) {
            gpaRecord = await computeAndSaveGPA(studentId, session, semester);
        }

        return gpaRecord;
    } catch (error) {
        throw new Error(`Error getting student GPA: ${error.message}`);
    }
};

/**
 * Get all GPA records for a student
 * @param {ObjectId} studentId - Student ID
 * @returns {Array} - Array of GPA records
 */
export const getAllStudentGPAs = async (studentId) => {
    try {
        const gpaRecords = await GPA.find({ studentId }).sort({ session: 1, semester: 1 });
        return gpaRecords;
    } catch (error) {
        throw new Error(`Error getting student GPAs: ${error.message}`);
    }
};
