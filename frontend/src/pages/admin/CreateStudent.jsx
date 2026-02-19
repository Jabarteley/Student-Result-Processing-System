import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const CreateStudent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: 'student123', // Default password
        department: '',
        faculty: 'Science',
        level: '100',
        admissionYear: new Date().getFullYear(),
        sessionAdmitted: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
        gender: 'male'
    });
    const [departments, setDepartments] = useState([]);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deptRes, sessRes] = await Promise.all([
                    api.get('/departments'),
                    api.get('/sessions')
                ]);
                setDepartments(deptRes.data.data);
                setSessions(sessRes.data.data);

                if (deptRes.data.data.length > 0) {
                    setFormData(prev => ({ ...prev, department: deptRes.data.data[0].name }));
                }
                if (sessRes.data.data.length > 0) {
                    const activeSession = sessRes.data.data.find(s => s.isActive) || sessRes.data.data[0];
                    setFormData(prev => ({ ...prev, sessionAdmitted: activeSession.name }));
                }
            } catch (error) {
                console.error('Error fetching dynamic data:', error);
            }
        };
        fetchData();
    }, []);

    const containerStyles = {
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto'
    };

    const headerStyles = { marginBottom: '32px' };
    const titleStyles = { fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' };
    const formGridStyles = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Send all data to /students endpoint which handles both User and Student creation
            await api.post('/students', formData);

            alert('Student registered successfully!');
            navigate('/admin/students');
        } catch (error) {
            console.error('Error creating student:', error);
            alert(error.response?.data?.message || 'Failed to register student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <h1 style={titleStyles}>Register New Student</h1>
            </div>

            <Card title="Student Information">
                <form onSubmit={handleSubmit}>
                    <div style={formGridStyles}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Alice Williams"
                                required
                            />
                        </div>

                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e.g. alice@student.ifatoss.edu.ng"
                            required
                        />

                        <Input
                            label="Default Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <Select
                            label="Department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                            options={departments.map(d => ({ value: d.name, label: d.name }))}
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

                        <Input
                            label="Admission Year"
                            type="number"
                            name="admissionYear"
                            value={formData.admissionYear}
                            onChange={handleChange}
                            required
                        />

                        <Select
                            label="Session Admitted"
                            name="sessionAdmitted"
                            value={formData.sessionAdmitted}
                            onChange={handleChange}
                            required
                            options={sessions.map(s => ({ value: s.name, label: s.name }))}
                        />

                        <Select
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' }
                            ]}
                        />
                    </div>

                    <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                        <Button variant="secondary" onClick={() => navigate('/admin/students')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Registering...' : 'Register Student'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateStudent;
