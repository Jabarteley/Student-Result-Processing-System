import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaBook, FaUsers, FaChartBar, FaCog, FaSignOutAlt, FaTachometerAlt, FaGraduationCap, FaFileAlt, FaClipboardCheck, FaChalkboardTeacher, FaUniversity } from 'react-icons/fa';

const Sidebar = ({ role, user }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const getMenuItems = () => {
        switch (role) {
            case 'admin':
            case 'super_admin':
                return [
                    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
                    { name: 'Users', path: '/admin/users', icon: <FaUsers /> },
                    { name: 'Students', path: '/admin/students', icon: <FaGraduationCap /> },
                    { name: 'Courses', path: '/admin/courses', icon: <FaBook /> },
                    { name: 'Sessions', path: '/admin/sessions', icon: <FaUniversity /> },
                    { name: 'Departments', path: '/admin/departments', icon: <FaUniversity /> },
                    { name: 'Results', path: '/admin/results', icon: <FaClipboardCheck /> },
                    { name: 'Grading', path: '/admin/grading', icon: <FaChartBar /> },
                    { name: 'Reports', path: '/admin/reports', icon: <FaFileAlt /> },
                    { name: 'Audit Logs', path: '/admin/audit-logs', icon: <FaFileAlt /> },
                    { name: 'Settings', path: '/admin/settings', icon: <FaCog /> },
                ];
            case 'lecturer':
                return [
                    { name: 'My Courses', path: '/lecturer/courses', icon: <FaBook /> },
                    // { name: 'Upload Scores', path: '/lecturer/upload', icon: <FaFileUpload /> }, // Now accessed via courses
                    // { name: 'Profile', path: '/lecturer/profile', icon: <FaUser /> },
                ];
            case 'hod':
                return [
                    { name: 'Dashboard', path: '/hod/dashboard', icon: <FaTachometerAlt /> },
                    { name: 'Approvals', path: '/hod/approvals', icon: <FaClipboardCheck /> },
                    { name: 'Reports', path: '/hod/reports', icon: <FaChartBar /> },
                ];
            case 'student':
                return [
                    { name: 'Dashboard', path: '/student/dashboard', icon: <FaTachometerAlt /> },
                    { name: 'My Results', path: '/student/results', icon: <FaFileAlt /> },
                    { name: 'Transcript', path: '/student/cumulative-record', icon: <FaGraduationCap /> },
                    { name: 'Download', path: '/student/download-results', icon: <FaBook /> },
                ];
            default:
                return [];
        }
    };

    const menuItems = getMenuItems();

    const sidebarStyles = {
        width: '260px',
        height: '100vh',
        backgroundColor: '#1f2937',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0
    };

    const logoStyles = {
        padding: '24px',
        fontSize: '20px',
        fontWeight: 'bold',
        borderBottom: '1px solid #374151',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    };

    const menuStyles = {
        flex: 1,
        padding: '24px 12px',
        overflowY: 'auto'
    };

    const footerStyles = {
        padding: '24px',
        borderTop: '1px solid #374151'
    };

    const activeLinkStyles = {
        backgroundColor: '#374151',
        color: '#10b981'
    };

    return (
        <div style={sidebarStyles}>
            <div style={logoStyles}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#10b981', borderRadius: '8px' }}></div>
                SRPS Portal
            </div>

            <nav style={menuStyles}>
                <div style={{
                    marginBottom: '24px',
                    padding: '0 12px',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    color: '#9ca3af',
                    fontWeight: '600',
                    letterSpacing: '0.05em'
                }}>
                    Main Menu
                </div>

                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '4px',
                            color: '#d1d5db',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                            ...(isActive ? activeLinkStyles : {})
                        })}
                    >
                        <span style={{ fontSize: '18px' }}>{item.icon}</span>
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div style={footerStyles}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <FaUser />
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>{user?.name || 'User'}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>{role?.replace('_', ' ').toUpperCase()}</div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px',
                        backgroundColor: 'transparent',
                        border: '1px solid #4b5563',
                        borderRadius: '6px',
                        color: '#d1d5db',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#374151'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    <FaSignOutAlt /> Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
