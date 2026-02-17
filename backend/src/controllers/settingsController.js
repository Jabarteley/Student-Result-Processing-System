import SystemSettings from '../models/SystemSettings.js';
import { logAction } from '../utils/auditLogger.js';

// Get system settings
export const getSettings = async (req, res) => {
    try {
        const settings = await SystemSettings.getSettings();

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching settings',
            error: error.message
        });
    }
};

// Update system settings
export const updateSettings = async (req, res) => {
    try {
        const updates = req.body;
        const settings = await SystemSettings.updateSettings(updates, req.user._id);

        // Log action
        await logAction({
            userId: req.user._id,
            action: 'UPDATE_SETTINGS',
            resource: 'SystemSettings',
            resourceId: settings._id,
            details: `Updated system settings`,
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.json({
            success: true,
            message: 'Settings updated successfully',
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating settings',
            error: error.message
        });
    }
};
