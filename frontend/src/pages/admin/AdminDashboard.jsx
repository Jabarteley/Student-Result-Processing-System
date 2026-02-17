import { useState, useEffect } from 'react';
import { dashboardService } from '../../services';
import Navbar from '../../components/common/Navbar';
import { FiUsers, FiBook, FiUserCheck, FiFileText } from 'react-icons/fi';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await dashboardService.getAdminDashboard();
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const stats = dashboardData?.stats || {};

    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome to the Student Result Processing System</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#667eea' }}>
                            <FiUsers />
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalStudents || 0}</h3>
                            <p>Total Students</p>
                            <span className="stat-detail">{stats.activeStudents || 0} active</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#f093fb' }}>
                            <FiUserCheck />
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalLecturers || 0}</h3>
                            <p>Total Lecturers</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#4facfe' }}>
                            <FiBook />
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalCourses || 0}</h3>
                            <p>Total Courses</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#43e97b' }}>
                            <FiFileText />
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalResults || 0}</h3>
                            <p>Approved Results</p>
                        </div>
                    </div>
                </div>

                <div className="recent-section">
                    <h2>Recent Students</h2>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Matric Number</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Level</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData?.recentStudents?.map((student) => (
                                    <tr key={student._id}>
                                        <td>{student.matricNumber}</td>
                                        <td>{student.userId?.name}</td>
                                        <td>{student.department}</td>
                                        <td>{student.level}</td>
                                        <td>
                                            <span className={`status-badge ${student.status}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
