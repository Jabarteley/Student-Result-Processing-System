import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiUser, FiHome } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (user?.role === 'admin' || user?.role === 'super_admin') {
            return '/admin/dashboard';
        } else if (user?.role === 'lecturer') {
            return '/lecturer/dashboard';
        } else if (user?.role === 'student') {
            return '/student/dashboard';
        }
        return '/';
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to={getDashboardLink()}>
                        <h1>SRPS</h1>
                    </Link>
                </div>

                <div className="navbar-menu">
                    <Link to={getDashboardLink()} className="nav-link">
                        <FiHome /> Dashboard
                    </Link>

                    <div className="navbar-user">
                        <FiUser />
                        <span>{user?.name}</span>
                        <span className="user-role">{user?.role}</span>
                    </div>

                    <button onClick={handleLogout} className="logout-button">
                        <FiLogOut /> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
