import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [lecturers, setLecturers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        courseCode: '',
        title: '',
        creditUnit: '',
        department: '',
        level: '',
        semester: '',
        lecturerId: '',
        description: '',
        isActive: true
    });

    const containerStyles = { padding: '24px', maxWidth: '800px', margin: '0 auto' };
    const headerStyles = { marginBottom: '32px' };
    const titleStyles = { fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' };
    const formGridStyles = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' };

    useEffect(() => {
        fetchDepartments();
        fetchCourseAndLecturers();
    }, [id]);

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments');
            setDepartments(response.data.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchCourseAndLecturers = async () => {
        try {
            // Fetch course
            const courseRes = await api.get(`/courses/${id}`);
            const course = courseRes.data.data;

            setFormData({
                courseCode: course.courseCode,
                title: course.title,
                creditUnit: course.creditUnit,
                department: course.department,
                level: course.level,
                semester: course.semester,
                lecturerId: course.lecturerId?._id || course.lecturerId || '', // Handle populated or unpopulated
                description: course.description || '',
                isActive: course.isActive
            });

            // Fetch lecturers for this department
            if (course.department) {
                fetchLecturers(course.department);
            }
        } catch (error) {
            console.error('Error fetching course:', error);
            alert('Failed to load course details');
            navigate('/admin/courses');
        }
    };

    const fetchLecturers = async (department) => {
        try {
            const response = await api.get('/users', {
                params: { role: 'lecturer', department }
            });
            setLecturers(response.data.data.map(l => ({
                value: l._id,
                label: l.name
            })));
        } catch (error) {
            console.error('Error fetching lecturers:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Refresh lecturers if department changes
        if (name === 'department') {
            fetchLecturers(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put(`/courses/${id}`, formData);
            alert('Course updated successfully!');
            navigate('/admin/courses');
        } catch (error) {
            console.error('Error updating course:', error);
            alert(error.response?.data?.message || 'Failed to update course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <h1 style={titleStyles}>Edit Course</h1>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <div style={formGridStyles}>
                        <Input
                            label="Course Code"
                            name="courseCode"
                            value={formData.courseCode}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Course Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Credit Unit"
                            type="number"
                            name="creditUnit"
                            value={formData.creditUnit}
                            onChange={handleChange}
                            min="1"
                            max="6"
                            required
                        />

                        <Select
                            label="Department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                            options={[
                                { value: '', label: 'Select Department' },
                                ...departments.map(d => ({ value: d.name, label: d.name }))
                            ]}
                        />

                        <Select
                            label="Level"
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            required
                            options={[
                                { value: '100', label: '100 Level' },
                                { value: '200', label: '200 Level' },
                                { value: '300', label: '300 Level' },
                                { value: '400', label: '400 Level' }
                            ]}
                        />

                        <Select
                            label="Semester"
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            required
                            options={[
                                { value: 'First', label: 'First Semester' },
                                { value: 'Second', label: 'Second Semester' }
                            ]}
                        />

                        <div style={{ gridColumn: '1 / -1' }}>
                            <Select
                                label="Assign Lecturer"
                                name="lecturerId"
                                value={formData.lecturerId}
                                onChange={handleChange}
                                options={lecturers}
                                placeholder="Select lecturer..."
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <Input
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <Select
                            label="Status"
                            name="isActive"
                            value={formData.isActive}
                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                            options={[
                                { value: true, label: 'Active' },
                                { value: false, label: 'Inactive' }
                            ]}
                        />
                    </div>

                    <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                        <Button variant="secondary" onClick={() => navigate('/admin/courses')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default EditCourse;
