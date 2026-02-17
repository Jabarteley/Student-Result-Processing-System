import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    const containerStyles = {
        padding: '24px',
        maxWidth: '1000px',
        margin: '0 auto'
    };

    const headerStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
    };

    const titleStyles = {
        fontSize: '28px',
        fontWeight: '700',
        color: '#111827'
    };

    const sectionGridStyles = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
    };

    const labelStyles = {
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '4px'
    };

    const valueStyles = {
        fontSize: '16px',
        fontWeight: '500',
        color: '#111827',
        marginBottom: '16px'
    };

    useEffect(() => {
        fetchStudentProfile();
    }, [id]);

    const fetchStudentProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/students/${id}`);
            setStudent(response.data.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            alert('Failed to load student profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading profile...</div>;
    }

    if (!student) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>Student not found</div>;
    }

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <div>
                    <h1 style={titleStyles}>{student.userId?.name}</h1>
                    <p style={{ color: '#6b7280' }}>Matric No: {student.matricNumber}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="secondary" onClick={() => navigate('/admin/students')}>
                        Back via List
                    </Button>
                    <Button onClick={() => navigate(`/admin/students/edit/${id}`)}>
                        Edit Profile
                    </Button>
                </div>
            </div>

            <div style={sectionGridStyles}>
                <Card title="Personal Information">
                    <div style={{ marginBottom: '16px' }}>
                        <div style={labelStyles}>Full Name</div>
                        <div style={valueStyles}>{student.userId?.name}</div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <div style={labelStyles}>Email Address</div>
                        <div style={valueStyles}>{student.userId?.email}</div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <div style={labelStyles}>Gender</div>
                        <div style={valueStyles}>{student.gender || 'N/A'}</div>
                    </div>
                </Card>

                <Card title="Academic Information">
                    <div style={{ marginBottom: '16px' }}>
                        <div style={labelStyles}>Department</div>
                        <div style={valueStyles}>{student.department}</div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <div style={labelStyles}>Faculty</div>
                        <div style={valueStyles}>{student.faculty}</div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <div style={labelStyles}>Current Level</div>
                        <div style={valueStyles}>{student.level} Level</div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <div style={labelStyles}>Status</div>
                        <div style={valueStyles}>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '12px',
                                backgroundColor: student.status === 'active' ? '#d1fae5' : '#fee2e2',
                                color: student.status === 'active' ? '#065f46' : '#991b1b',
                                fontSize: '14px'
                            }}>
                                {student.status.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </Card>

                <Card title="Admission Details">
                    <div style={{ marginBottom: '16px' }}>
                        <div style={labelStyles}>Admission Year</div>
                        <div style={valueStyles}>{student.admissionYear}</div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <div style={labelStyles}>Session Admitted</div>
                        <div style={valueStyles}>{student.sessionAdmitted}</div>
                    </div>
                </Card>

                <Card title="Academic Performance">
                    <div style={{ marginBottom: '16px' }}>
                        <div style={labelStyles}>Current CGPA</div>
                        <div style={{ ...valueStyles, fontSize: '24px', color: '#4f46e5' }}>
                            {student.cgpa?.toFixed(2) || '0.00'}
                        </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <div style={labelStyles}>Total Units Taken</div>
                        <div style={valueStyles}>{student.unitsTaken || 0}</div>
                    </div>
                </Card>
            </div>

            <Card title="Recent Results (Placeholder)">
                <p style={{ color: '#6b7280', padding: '20px', textAlign: 'center' }}>
                    Recent academic results will appear here once implemented.
                </p>
            </Card>
        </div>
    );
};

export default StudentProfile;
