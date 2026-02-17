import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const GradingConfig = () => {
    const [gradingScales, setGradingScales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingScale, setEditingScale] = useState(null);

    const containerStyles = { padding: '24px', maxWidth: '1000px', margin: '0 auto' };
    const headerStyles = { marginBottom: '32px' };
    const titleStyles = { fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' };
    const tableStyles = { width: '100%', borderCollapse: 'collapse', marginTop: '16px' };
    const thStyles = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' };
    const tdStyles = { padding: '16px 12px', borderBottom: '1px solid #e5e7eb' };

    useEffect(() => {
        fetchGradingScales();
    }, []);

    const fetchGradingScales = async () => {
        try {
            setLoading(true);
            const response = await api.get('/grading');
            setGradingScales(response.data.data);
        } catch (error) {
            console.error('Error fetching grading scales:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveScale = async (e) => {
        e.preventDefault();
        try {
            if (editingScale._id) {
                await api.put(`/grading/${editingScale._id}`, editingScale);
            } else {
                await api.post('/grading', editingScale);
            }
            alert('Grading scale saved successfully');
            setShowEditModal(false);
            fetchGradingScales();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save grading scale');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this grade?')) return;
        try {
            await api.delete(`/grading/${id}`);
            fetchGradingScales();
        } catch (error) {
            alert('Failed to delete grading scale');
        }
    };

    const openEditModal = (scale) => {
        setEditingScale(scale || { grade: '', minScore: 0, maxScore: 100, gradePoint: 0 });
        setShowEditModal(true);
    };

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <h1 style={titleStyles}>Grading System Configuration</h1>
                <p style={{ color: '#6b7280' }}>Manage grade boundaries and points for the university</p>
            </div>

            <Card>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                    <Button onClick={() => openEditModal(null)}>+ Add Grade</Button>
                </div>

                <table style={tableStyles}>
                    <thead>
                        <tr>
                            <th style={thStyles}>Grade</th>
                            <th style={thStyles}>Score Range</th>
                            <th style={thStyles}>Grade Point</th>
                            <th style={thStyles}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gradingScales.map(scale => (
                            <tr key={scale._id}>
                                <td style={{ ...tdStyles, fontWeight: 'bold' }}>{scale.grade}</td>
                                <td style={tdStyles}>{scale.minScore} - {scale.maxScore}</td>
                                <td style={tdStyles}>{scale.gradePoint}</td>
                                <td style={tdStyles}>
                                    <Button size="small" variant="secondary" onClick={() => openEditModal(scale)} style={{ marginRight: '8px' }}>
                                        Edit
                                    </Button>
                                    <Button size="small" variant="danger" onClick={() => handleDelete(scale._id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title={editingScale?._id ? "Edit Grade" : "Add New Grade"}
            >
                <form onSubmit={handleSaveScale}>
                    <Input
                        label="Grade Letter"
                        value={editingScale?.grade || ''}
                        onChange={(e) => setEditingScale({ ...editingScale, grade: e.target.value.toUpperCase() })}
                        placeholder="e.g. A, B, C"
                        required
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Input
                            label="Min Score"
                            type="number"
                            value={editingScale?.minScore || 0}
                            onChange={(e) => setEditingScale({ ...editingScale, minScore: parseInt(e.target.value) })}
                            required
                        />
                        <Input
                            label="Max Score"
                            type="number"
                            value={editingScale?.maxScore || 0}
                            onChange={(e) => setEditingScale({ ...editingScale, maxScore: parseInt(e.target.value) })}
                            required
                        />
                    </div>
                    <Input
                        label="Grade Point"
                        type="number"
                        step="0.1"
                        value={editingScale?.gradePoint || 0}
                        onChange={(e) => setEditingScale({ ...editingScale, gradePoint: parseFloat(e.target.value) })}
                        required
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                        <Button type="submit">Save Grade</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default GradingConfig;
