import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const HODDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        pendingApprovals: 0,
        courses: 0,
        students: 0,
        departmentName: ''
    });
    const [recentSubmissions, setRecentSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await api.get('/hod/dashboard');
            if (response.data && response.data.success) {
                setStats(response.data.data.stats);
                setRecentSubmissions(response.data.data.recentSubmissions);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const cardStyles = { textAlign: 'center', padding: '20px' };
    const valueStyles = { fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: '8px 0' };
    const labelStyles = { color: '#6b7280', fontSize: '14px' };

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Department Dashboard</h1>
                <p style={{ color: '#6b7280' }}>Welcome, Head of {stats.departmentName || 'Department'}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <Card>
                    <div style={cardStyles}>
                        <div style={labelStyles}>Pending Result Approvals</div>
                        <div style={{ ...valueStyles, color: '#f59e0b' }}>{stats.pendingApprovals}</div>
                        <Button size="small" onClick={() => navigate('/hod/approvals')}>Review Now</Button>
                    </div>
                </Card>
                <Card>
                    <div style={cardStyles}>
                        <div style={labelStyles}>Active Courses</div>
                        <div style={valueStyles}>{stats.courses}</div>
                    </div>
                </Card>
                <Card>
                    <div style={cardStyles}>
                        <div style={labelStyles}>Total Students</div>
                        <div style={valueStyles}>{stats.students}</div>
                    </div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <Card title="Quick Actions">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Button variant="outline" onClick={() => navigate('/hod/reports')}>View Department Reports</Button>
                        <Button variant="outline" onClick={() => navigate('/hod/lecturers')}>Manage Lecturers</Button>
                    </div>
                </Card>
                <Card title="Recent Submissions">
                    {recentSubmissions.length === 0 ? (
                        <p className="text-gray-500">No recent submissions.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Course</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Lecturer</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSubmissions.map(sub => (
                                    <tr key={sub._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ fontWeight: 'bold' }}>{sub.courseId?.courseCode}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{sub.courseId?.title}</div>
                                        </td>
                                        <td style={{ padding: '12px' }}>{sub.submittedBy?.name}</td>
                                        <td style={{ padding: '12px' }}>{new Date(sub.submittedAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '12px' }}>
                                            <Button size="sm" onClick={() => navigate('/hod/approvals')}>Review</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default HODDashboard;
