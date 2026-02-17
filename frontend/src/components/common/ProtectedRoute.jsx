import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>Loading...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        if (user.role === 'admin' || user.role === 'super_admin') {
            return <Navigate to="/admin/dashboard" replace />;
        } else if (user.role === 'lecturer') {
            return <Navigate to="/lecturer/dashboard" replace />;
        } else if (user.role === 'student') {
            return <Navigate to="/student/dashboard" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
