import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const CreateCourse = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [lecturers, setLecturers] = useState([]);
    const [formData, setFormData] = useState({
        courseCode: '',
        title: '',
        creditUnit: 3,
        department: '',
        level: '100',
        semester: 'First',
        lecturerId: '',
        description: ''
    });

    const containerStyles = { padding: '24px', maxWidth: '800px', margin: '0 auto' };
    const headerStyles = { marginBottom: '32px' };
    const titleStyles = { fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' };
    const formGridStyles = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' };

    useEffect(() => {
        fetchLecturers();
    }, [formData.department]);

    const fetchLecturers = async () => {
        try {
            const params = { role: 'lecturer' };
            if (formData.department) params.department = formData.department;

            const response = await api.get('/users', { params });
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/courses', formData);
            alert('Course created successfully!');
            navigate('/admin/courses');
        } catch (error) {
            console.error('Error creating course:', error);
            alert(error.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <h1 style={titleStyles}>Create New Course</h1>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <div style={formGridStyles}>
                        <Input
                            label="Course Code"
                            name="courseCode"
                            value={formData.courseCode}
                            onChange={handleChange}
                            placeholder="e.g. CSC101"
                            required
                        />

                        <Input
                            label="Course Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Introduction to Computer Science"
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
                                { value: 'Computer Science', label: 'Computer Science' },
                                { value: 'Mathematics', label: 'Mathematics' },
                                { value: 'Physics', label: 'Physics' }
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
                                label="Assign Lecturer (Optional)"
                                name="lecturerId"
                                value={formData.lecturerId}
                                onChange={handleChange}
                                options={lecturers}
                                placeholder="Select lecturer..."
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <Input
                                label="Description (Optional)"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Brief description of the course..."
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                        <Button variant="secondary" onClick={() => navigate('/admin/courses')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Course'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateCourse;
