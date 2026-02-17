import { useState, useEffect } from 'react';
import { dashboardService } from '../../services';
import Navbar from '../../components/common/Navbar';
import { FiBook, FiUpload, FiCheckCircle } from 'react-icons/fi';
import '../admin/AdminDashboard.css';

const LecturerDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await dashboardService.getLecturerDashboard();
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
                    <h1>Lecturer Dashboard</h1>
                    <p>Manage your courses and upload student results</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#667eea' }}>
                            <FiBook />
                        </div>
                        <div className="stat-content">
                            <h3>{stats.assignedCourses || 0}</h3>
                            <p>Assigned Courses</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#f093fb' }}>
                            <FiUpload />
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalResultsUploaded || 0}</h3>
                            <p>Results Uploaded</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#ffa726' }}>
                            <FiCheckCircle />
                        </div>
                        <div className="stat-content">
                            <h3>{stats.pendingApprovals || 0}</h3>
                            <p>Pending Approvals</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#43e97b' }}>
                            <FiCheckCircle />
                        </div>
                        <div className="stat-content">
                            <h3>{stats.approvedResults || 0}</h3>
                            <p>Approved Results</p>
                        </div>
                    </div>
                </div>

                <div className="recent-section">
                    <h2>My Courses</h2>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Course Title</th>
                                    <th>Credit Units</th>
                                    <th>Level</th>
                                    <th>Semester</th>
                                    <th>Department</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData?.courses?.map((course) => (
                                    <tr key={course._id}>
                                        <td><strong>{course.courseCode}</strong></td>
                                        <td>{course.title}</td>
                                        <td>{course.creditUnit}</td>
                                        <td>{course.level}</td>
                                        <td>{course.semester}</td>
                                        <td>{course.department}</td>
                                    </tr>
                                ))}
                                {(!dashboardData?.courses || dashboardData.courses.length === 0) && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                            No courses assigned yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LecturerDashboard;
