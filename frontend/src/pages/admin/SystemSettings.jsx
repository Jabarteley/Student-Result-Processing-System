import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const SystemSettings = () => {
    const [settings, setSettings] = useState({
        universityName: '',
        currentSession: '',
        currentSemester: '',
        hodApprovalRequired: false,
        allowResultEdit: true,
        emailNotifications: false
    });
    const [loading, setLoading] = useState(false);

    const containerStyles = { padding: '24px', maxWidth: '800px', margin: '0 auto' };

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            setSettings(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/settings', settings);
            alert('Settings updated successfully');
        } catch (error) {
            alert('Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    const checkboxGroupStyles = {
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        marginBottom: '24px'
    };

    const checkboxLabelStyles = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
        cursor: 'pointer',
        fontWeight: '500'
    };

    return (
        <div style={containerStyles}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>System Settings</h1>

            <Card>
                <form onSubmit={handleSave}>
                    <Input
                        label="University Name"
                        name="universityName"
                        value={settings.universityName}
                        onChange={handleChange}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <Input
                            label="Current Session"
                            name="currentSession"
                            value={settings.currentSession}
                            onChange={handleChange}
                            placeholder="2023/2024"
                        />
                        <Select
                            label="Current Semester"
                            name="currentSemester"
                            value={settings.currentSemester}
                            onChange={handleChange}
                            options={[
                                { value: 'First', label: 'First Semester' },
                                { value: 'Second', label: 'Second Semester' }
                            ]}
                        />
                    </div>

                    <div style={checkboxGroupStyles}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                            Configuration Flags
                        </h3>

                        <label style={checkboxLabelStyles}>
                            <input
                                type="checkbox"
                                name="hodApprovalRequired"
                                checked={settings.hodApprovalRequired}
                                onChange={handleChange}
                                style={{ marginRight: '10px', width: '18px', height: '18px' }}
                            />
                            Require HOD Approval for Results
                        </label>

                        <label style={checkboxLabelStyles}>
                            <input
                                type="checkbox"
                                name="allowResultEdit"
                                checked={settings.allowResultEdit}
                                onChange={handleChange}
                                style={{ marginRight: '10px', width: '18px', height: '18px' }}
                            />
                            Allow Lecturers to Edit Submitted Results
                        </label>

                        <label style={checkboxLabelStyles}>
                            <input
                                type="checkbox"
                                name="emailNotifications"
                                checked={settings.emailNotifications}
                                onChange={handleChange}
                                style={{ marginRight: '10px', width: '18px', height: '18px' }}
                            />
                            Enable Email Notifications
                        </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default SystemSettings;
