import GradingScale from '../models/GradingScale.js';
import { logAction } from '../utils/auditLogger.js';

// Get all grading scales
export const getAllGradingScales = async (req, res) => {
    try {
        const gradingScales = await GradingScale.find({ isActive: true }).sort({ minScore: -1 });

        res.json({
            success: true,
            data: gradingScales
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching grading scales',
            error: error.message
        });
    }
};

// Create grading scale
export const createGradingScale = async (req, res) => {
    try {
        const { minScore, maxScore, grade, gradePoint } = req.body;

        // Check for overlapping ranges
        const overlapping = await GradingScale.findOne({
            isActive: true,
            $or: [
                { minScore: { $lte: maxScore }, maxScore: { $gte: minScore } }
            ]
        });

        if (overlapping) {
            return res.status(400).json({
                success: false,
                message: 'Score range overlaps with existing grading scale'
            });
        }

        const gradingScale = await GradingScale.create({
            minScore,
            maxScore,
            grade,
            gradePoint
        });

        // Log action
        await logAction({
            userId: req.user._id,
            action: 'CREATE_GRADING_SCALE',
            resource: 'GradingScale',
            resourceId: gradingScale._id,
            details: `Created grading scale: ${grade} (${minScore}-${maxScore})`,
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.status(201).json({
            success: true,
            message: 'Grading scale created successfully',
            data: gradingScale
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating grading scale',
            error: error.message
        });
    }
};

// Update grading scale
export const updateGradingScale = async (req, res) => {
    try {
        const { id } = req.params;
        const { minScore, maxScore, grade, gradePoint } = req.body;

        const gradingScale = await GradingScale.findById(id);
        if (!gradingScale) {
            return res.status(404).json({
                success: false,
                message: 'Grading scale not found'
            });
        }

        // Update fields
        if (minScore !== undefined) gradingScale.minScore = minScore;
        if (maxScore !== undefined) gradingScale.maxScore = maxScore;
        if (grade) gradingScale.grade = grade;
        if (gradePoint !== undefined) gradingScale.gradePoint = gradePoint;

        await gradingScale.save();

        // Log action
        await logAction({
            userId: req.user._id,
            action: 'UPDATE_GRADING_SCALE',
            resource: 'GradingScale',
            resourceId: gradingScale._id,
            details: `Updated grading scale: ${gradingScale.grade}`,
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.json({
            success: true,
            message: 'Grading scale updated successfully',
            data: gradingScale
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating grading scale',
            error: error.message
        });
    }
};

// Delete grading scale
export const deleteGradingScale = async (req, res) => {
    try {
        const { id } = req.params;

        const gradingScale = await GradingScale.findById(id);
        if (!gradingScale) {
            return res.status(404).json({
                success: false,
                message: 'Grading scale not found'
            });
        }

        // Soft delete
        gradingScale.isActive = false;
        await gradingScale.save();

        // Log action
        await logAction({
            userId: req.user._id,
            action: 'DELETE_GRADING_SCALE',
            resource: 'GradingScale',
            resourceId: gradingScale._id,
            details: `Deleted grading scale: ${gradingScale.grade}`,
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.json({
            success: true,
            message: 'Grading scale deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting grading scale',
            error: error.message
        });
    }
};

// Initialize default grading scale
export const initializeDefaultGrading = async (req, res) => {
    try {
        // Check if grading scales already exist
        const existing = await GradingScale.findOne();
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Grading scales already initialized'
            });
        }

        const defaultScales = [
            { minScore: 70, maxScore: 100, grade: 'A', gradePoint: 5 },
            { minScore: 60, maxScore: 69, grade: 'B', gradePoint: 4 },
            { minScore: 50, maxScore: 59, grade: 'C', gradePoint: 3 },
            { minScore: 45, maxScore: 49, grade: 'D', gradePoint: 2 },
            { minScore: 40, maxScore: 44, grade: 'E', gradePoint: 1 },
            { minScore: 0, maxScore: 39, grade: 'F', gradePoint: 0 }
        ];

        await GradingScale.insertMany(defaultScales);

        // Log action
        await logAction({
            userId: req.user._id,
            action: 'INITIALIZE_GRADING',
            resource: 'GradingScale',
            details: 'Initialized default grading scales',
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.json({
            success: true,
            message: 'Default grading scales initialized successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error initializing grading scales',
            error: error.message
        });
    }
};
