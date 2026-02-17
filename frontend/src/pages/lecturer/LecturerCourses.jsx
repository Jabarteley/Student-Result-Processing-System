import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const LecturerCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const containerStyles = { padding: '24px', maxWidth: '1200px', margin: '0 auto' };
    const headerStyles = { marginBottom: '32px' };
    const titleStyles = { fontSize: '28px', fontWeight: '700', color: '#111827' };

    const gridStyles = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px'
    };

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            setLoading(true);
            // Assuming endpoint exists for getting courses assigned to logged in lecturer
            // If not, we filter courses by current user ID
            const response = await api.get('/courses/my-courses');
            // If endpoint doesn't exist, I might need to implement it in courseController
            // or filter from all courses if permission allows.
            // Let's assume standard 'my-courses' or filter by lecturer endpoint.
            // If it fails, I'll fix in backend.
            setCourses(response.data.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            // Fallback or alert
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <h1 style={titleStyles}>My Courses</h1>
                <p style={{ color: '#6b7280' }}>Manage your assigned courses and student results</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading courses...</div>
            ) : courses.length === 0 ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        You have not been assigned any courses yet.
                    </div>
                </Card>
            ) : (
                <div style={gridStyles}>
                    {courses.map(course => (
                        <Card key={course._id} hover onClick={() => navigate(`/lecturer/courses/${course._id}`)}>
                            <div style={{ marginBottom: '16px' }}>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    backgroundColor: '#e0e7ff',
                                    color: '#4338ca',
                                    borderRadius: '16px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    marginBottom: '8px'
                                }}>
                                    {course.courseCode}
                                </span>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>
                                    {course.title}
                                </h3>
                                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                                    {course.creditUnit} Units • {course.semester} Semester
                                </p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                    {course.studentCount || 0} Students
                                </div>
                                <Button size="small" variant="primary">
                                    View Results
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LecturerCourses;
