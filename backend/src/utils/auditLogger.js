import AuditLog from '../models/AuditLog.js';

/**
 * Log an action to the audit log
 * @param {Object} params - Audit log parameters
 * @param {ObjectId} params.userId - User who performed the action
 * @param {String} params.action - Action type
 * @param {String} params.resource - Resource type
 * @param {ObjectId} params.resourceId - Resource ID (optional)
 * @param {Object} params.changes - Changes made (optional)
 * @param {String} params.ipAddress - IP address (optional)
 * @param {String} params.userAgent - User agent (optional)
 * @param {String} params.description - Description (optional)
 */
export const logAction = async ({
    userId,
    action,
    resource,
    resourceId = null,
    changes = null,
    ipAddress = null,
    userAgent = null,
    description = null
}) => {
    try {
        const auditLog = await AuditLog.create({
            userId,
            action,
            resource,
            resourceId,
            changes,
            ipAddress,
            userAgent,
            description,
            timestamp: new Date()
        });

        return auditLog;
    } catch (error) {
        console.error('Error logging action:', error);
        // Don't throw error to prevent audit logging from breaking the main operation
    }
};

/**
 * Get audit logs with filters
 * @param {Object} filters - Filter parameters
 * @param {ObjectId} filters.userId - Filter by user
 * @param {String} filters.action - Filter by action
 * @param {String} filters.resource - Filter by resource
 * @param {Date} filters.startDate - Filter by start date
 * @param {Date} filters.endDate - Filter by end date
 * @param {Number} filters.page - Page number
 * @param {Number} filters.limit - Items per page
 * @returns {Object} - { logs, total, page, pages }
 */
export const getAuditLogs = async (filters = {}) => {
    try {
        const {
            userId,
            action,
            resource,
            startDate,
            endDate,
            page = 1,
            limit = 50
        } = filters;

        // Build query
        const query = {};

        if (userId) query.userId = userId;
        if (action) query.action = action;
        if (resource) query.resource = resource;

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            AuditLog.find(query)
                .populate('userId', 'name email role')
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit),
            AuditLog.countDocuments(query)
        ]);

        return {
            logs,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        };
    } catch (error) {
        throw new Error(`Error getting audit logs: ${error.message}`);
    }
};

export default {
    logAction,
    getAuditLogs
};
