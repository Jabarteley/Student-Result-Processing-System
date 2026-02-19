import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        department: '',
        isActive: true
    });
    const [departments, setDepartments] = useState([]);

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

    const formGridStyles = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
    };

    useEffect(() => {
        fetchUser();
        fetchDepartments();
    }, [id]);

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments');
            setDepartments(response.data.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchUser = async () => {
        try {
            setFetching(true);
            const response = await api.get(`/users/${id}`);
            const user = response.data.data;
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department || '',
                isActive: user.isActive
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            alert('Failed to load user details');
            navigate('/admin/users');
        } finally {
            setFetching(false);
        }
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
            await api.put(`/users/${id}`, formData);
            alert('User updated successfully!');
            navigate('/admin/users');
        } catch (error) {
            console.error('Error updating user:', error);
            alert(error.response?.data?.message || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                Loading user details...
            </div>
        );
    }

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <h1 style={titleStyles}>Edit User</h1>
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
                                required
                            />
                        </div>

                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
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
                                { value: 'lecturer', label: 'Lecturer' },
                                { value: 'student', label: 'Student' }
                            ]}
                        />

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

                        <Select
                            label="Status"
                            name="isActive"
                            value={formData.isActive}
                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                            required
                            options={[
                                { value: true, label: 'Active' },
                                { value: false, label: 'Inactive' }
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
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default EditUser;
