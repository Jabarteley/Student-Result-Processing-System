import Session from '../models/Session.js';
import { logAction } from '../utils/auditLogger.js';

/**
 * @desc    Get all sessions
 * @route   GET /api/sessions
 * @access  Private
 */
export const getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: sessions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Get active session
 * @route   GET /api/sessions/active
 * @access  Private
 */
export const getActiveSession = async (req, res) => {
    try {
        const session = await Session.findOne({ isActive: true });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'No active session found'
            });
        }

        res.status(200).json({
            success: true,
            data: session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Create new session
 * @route   POST /api/sessions
 * @access  Private (Admin only)
 */
export const createSession = async (req, res) => {
    try {
        const { name, startDate, endDate } = req.body;

        // Check if session already exists
        const sessionExists = await Session.findOne({ name });
        if (sessionExists) {
            return res.status(400).json({
                success: false,
                message: 'Session already exists'
            });
        }

        const session = await Session.create({
            name,
            startDate,
            endDate,
            isActive: false,
            semesters: [
                { name: 'First', isLocked: false },
                { name: 'Second', isLocked: false }
            ]
        });

        await logAction({
            userId: req.user._id,
            action: 'CREATE',
            resource: 'Session',
            resourceId: session._id,
            description: `Created session: ${name}`
        });

        res.status(201).json({
            success: true,
            message: 'Session created successfully',
            data: session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Set active session
 * @route   PUT /api/sessions/:id/activate
 * @access  Private (Admin only)
 */
export const setActiveSession = async (req, res) => {
    try {
        // Deactivate all sessions
        await Session.updateMany({}, { isActive: false });

        // Activate the selected session
        const session = await Session.findByIdAndUpdate(
            req.params.id,
            { isActive: true },
            { new: true }
        );

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        await logAction({
            userId: req.user._id,
            action: 'UPDATE',
            resource: 'Session',
            resourceId: session._id,
            description: `Activated session: ${session.name}`
        });

        res.status(200).json({
            success: true,
            message: 'Session activated successfully',
            data: session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Lock semester
 * @route   PUT /api/sessions/:id/lock-semester
 * @access  Private (Admin only)
 */
export const lockSemester = async (req, res) => {
    try {
        const { semester } = req.body; // "First" or "Second"

        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        await session.lockSemester(semester, req.user._id);

        await logAction({
            userId: req.user._id,
            action: 'LOCK_SEMESTER',
            resource: 'Session',
            resourceId: session._id,
            description: `Locked ${semester} semester for session ${session.name}`
        });

        res.status(200).json({
            success: true,
            message: `${semester} semester locked successfully`,
            data: session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Unlock semester
 * @route   PUT /api/sessions/:id/unlock-semester
 * @access  Private (Admin only)
 */
export const unlockSemester = async (req, res) => {
    try {
        const { semester } = req.body;

        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        await session.unlockSemester(semester);

        await logAction({
            userId: req.user._id,
            action: 'UNLOCK_SEMESTER',
            resource: 'Session',
            resourceId: session._id,
            description: `Unlocked ${semester} semester for session ${session.name}`
        });

        res.status(200).json({
            success: true,
            message: `${semester} semester unlocked successfully`,
            data: session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
