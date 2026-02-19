import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const CreateUser = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'lecturer',
        department: '',
        faculty: 'Science' // Default faculty
    });
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get('/departments');
                setDepartments(response.data.data);
                if (response.data.data.length > 0) {
                    setFormData(prev => ({ ...prev, department: response.data.data[0].name }));
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchDepartments();
    }, []);

    const containerStyles = {
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto'
    };

    const headerStyles = {
        marginBottom: '32px'
    };

    const titleStyles = {
        fontSize: '28px',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '8px'
    };

    const subtitleStyles = {
        fontSize: '16px',
        color: '#6b7280'
    };

    const formGridStyles = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/users', formData);
            alert('User created successfully!');
            navigate('/admin/users');
        } catch (error) {
            console.error('Error creating user:', error);
            alert(error.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <h1 style={titleStyles}>Create New User</h1>
                <p style={subtitleStyles}>Add a new user to the system</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <div style={formGridStyles}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                                required
                            />
                        </div>

                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e.g. john@ifatoss.edu.ng"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                        />

                        <Select
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            options={[
                                { value: 'admin', label: 'Administrator' },
                                { value: 'hod', label: 'Head of Department' },
                                { value: 'lecturer', label: 'Lecturer' }
                            ]}
                        />
                        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '-16px', marginBottom: '16px' }}>
                            Note: To add students, please use the <strong>Student Management</strong> section.
                        </p>

                        <Select
                            label="Department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required={formData.role !== 'admin'}
                            options={[
                                { value: '', label: 'Select Department' },
                                ...departments.map(d => ({ value: d.name, label: d.name }))
                            ]}
                        />
                    </div>

                    <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/admin/users')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateUser;
