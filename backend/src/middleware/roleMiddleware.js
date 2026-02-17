/**
 * Role-based access control middleware
 * @param  {...String} roles - Allowed roles
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }

        next();
    };
};

/**
 * Shorthand middleware for admin-only routes
 */
export const requireAdmin = authorize('super_admin', 'admin');

/**
 * Shorthand middleware for lecturer routes
 */
export const requireLecturer = authorize('super_admin', 'admin', 'lecturer');

/**
 * Shorthand middleware for student routes
 */
export const requireStudent = authorize('super_admin', 'admin', 'lecturer', 'student');
