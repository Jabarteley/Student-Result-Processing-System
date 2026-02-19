import Department from '../models/Department.js';
import { logAction } from '../utils/auditLogger.js';

/**
 * @desc    Get all departments
 * @route   GET /api/departments
 * @access  Private
 */
export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find({ isActive: true }).sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: departments.length,
            data: departments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Get single department
 * @route   GET /api/departments/:id
 * @access  Private
 */
export const getDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        res.status(200).json({
            success: true,
            data: department
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Create new department
 * @route   POST /api/departments
 * @access  Private (Admin only)
 */
export const createDepartment = async (req, res) => {
    try {
        const { name, code, faculty, description } = req.body;

        // Check if department already exists
        const departmentExists = await Department.findOne({
            $or: [{ name }, { code }]
        });

        if (departmentExists) {
            return res.status(400).json({
                success: false,
                message: 'Department with this name or code already exists'
            });
        }

        const department = await Department.create({
            name,
            code,
            faculty,
            description
        });

        await logAction({
            userId: req.user._id,
            action: 'CREATE',
            resource: 'Department',
            resourceId: department._id,
            description: `Created department: ${name} (${code})`
        });

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: department
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Update department
 * @route   PUT /api/departments/:id
 * @access  Private (Admin only)
 */
export const updateDepartment = async (req, res) => {
    try {
        const { name, code, faculty, description, isActive } = req.body;

        let department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        department = await Department.findByIdAndUpdate(
            req.params.id,
            { name, code, faculty, description, isActive, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        await logAction({
            userId: req.user._id,
            action: 'UPDATE',
            resource: 'Department',
            resourceId: department._id,
            description: `Updated department: ${name}`
        });

        res.status(200).json({
            success: true,
            message: 'Department updated successfully',
            data: department
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Delete department (Soft delete by setting isActive to false)
 * @route   DELETE /api/departments/:id
 * @access  Private (Admin only)
 */
export const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        // We'll do a soft delete for now to preserve relationships
        department.isActive = false;
        await department.save();

        await logAction({
            userId: req.user._id,
            action: 'DELETE',
            resource: 'Department',
            resourceId: department._id,
            description: `Deleted department: ${department.name}`
        });

        res.status(200).json({
            success: true,
            message: 'Department deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
