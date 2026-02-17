import AuditLog from '../models/AuditLog.js';

// Get audit logs
export const getAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, action, user, startDate, endDate } = req.query;

        const query = {};
        if (action) query.action = action;
        if (user) query.userId = user; // Assuming userId is passed, or user name search if complex
        if (startDate && endDate) {
            query.timestamp = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const logs = await AuditLog.find(query)
            .populate('userId', 'name email role')
            .sort({ timestamp: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await AuditLog.countDocuments(query);

        res.json({
            success: true,
            data: logs,
            pagination: {
                total: count,
                page: parseInt(page),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching audit logs',
            error: error.message
        });
    }
};
