import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [studentProfile, setStudentProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock data for initial render if API not fully ready
    // Ideally we fetch from `/students/me` or similar
    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            const response = await api.get('/dashboard/student');
            if (response.data && response.data.success) {
                const { student, stats } = response.data.data;
                setStudentProfile({
                    name: student.userId.name,
                    matricNumber: student.matricNumber,
                    department: student.department,
                    level: student.level,
                    currentCGPA: stats.currentCGPA || 0.00,
                    unitsTaken: stats.totalCreditUnits || 0,
                    outstandingCourses: 0 // You might want to calculate this from failed courses if available
                });
            }
        } catch (error) {
            console.error('Error fetching student dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const containerStyles = { padding: '24px', maxWidth: '1200px', margin: '0 auto' };
    const statCardStyles = { textAlign: 'center', padding: '24px' };
    const statValueStyles = { fontSize: '48px', fontWeight: '800', color: '#4f46e5', margin: '8px 0' };
    const statLabelStyles = { color: '#6b7280', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' };
    const linkGridStyles = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '32px' };

    return (
        <div style={containerStyles}>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Welcome, {studentProfile?.name}</h1>
                    <p style={{ color: '#6b7280' }}>
                        {studentProfile?.matricNumber} • {studentProfile?.level} Level • {studentProfile?.department}
                    </p>
                </div>
                <div style={{ padding: '8px 16px', backgroundColor: '#ecfccb', color: '#3f6212', borderRadius: '20px', fontWeight: '600' }}>
                    Active Status
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <Card>
                    <div style={statCardStyles}>
                        <div style={statLabelStyles}>Current CGPA</div>
                        <div style={statValueStyles}>{studentProfile?.currentCGPA}</div>
                        <div style={{ fontSize: '14px', color: '#10b981' }}>Good Standing</div>
                    </div>
                </Card>
                <Card>
                    <div style={statCardStyles}>
                        <div style={statLabelStyles}>Total Units</div>
                        <div style={{ ...statValueStyles, fontSize: '36px', color: '#374151' }}>{studentProfile?.unitsTaken}</div>
                    </div>
                </Card>
                <Card>
                    <div style={statCardStyles}>
                        <div style={statLabelStyles}>Outstanding</div>
                        <div style={{ ...statValueStyles, fontSize: '36px', color: '#ef4444' }}>{studentProfile?.outstandingCourses}</div>
                    </div>
                </Card>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '700', marginTop: '40px', marginBottom: '16px' }}>Quick Access</h2>
            <div style={linkGridStyles}>
                <Card hover onClick={() => navigate('/student/results')}>
                    <div style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>Semester Results</h3>
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>Check your grades for the current and past semesters.</p>
                    </div>
                </Card>
                <Card hover onClick={() => navigate('/student/cumulative-record')}>
                    <div style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>Unofficial Transcript</h3>
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>View your full academic history and cumulative record.</p>
                    </div>
                </Card>
                <Card hover onClick={() => navigate('/student/download-results')}>
                    <div style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>Download Result</h3>
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>Get a PDF copy of your semester result sheet.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default StudentDashboard;
