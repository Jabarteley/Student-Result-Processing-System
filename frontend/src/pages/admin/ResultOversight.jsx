import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const ResultOversight = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        session: '',
        semester: '',
        department: '',
        level: '',
        courseId: '' // Optional
    });
    const [courses, setCourses] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedResults, setSelectedResults] = useState([]);
    const [showOverrideModal, setShowOverrideModal] = useState(false);
    const [overrideData, setOverrideData] = useState({ resultId: '', newScore: '', reason: '' });

    const containerStyles = { padding: '24px', maxWidth: '1400px', margin: '0 auto' };
    const headerStyles = { marginBottom: '32px' };
    const titleStyles = { fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' };
    const filtersStyles = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' };
    const tableStyles = { width: '100%', borderCollapse: 'collapse' };
    const thStyles = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: '14px', fontWeight: '600' };
    const tdStyles = { padding: '14px 12px', borderBottom: '1px solid #e5e7eb', fontSize: '14px' };

    const statusBadge = (status) => {
        const colors = {
            draft: '#9ca3af',
            submitted: '#f59e0b',
            hod_approved: '#3b82f6',
            published: '#10b981',
            rejected: '#ef4444'
        };
        return (
            <span style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: `${colors[status] || '#9ca3af'}20`,
                color: colors[status] || '#9ca3af'
            }}>
                {status?.toUpperCase().replace('_', ' ')}
            </span>
        );
    };

    useEffect(() => {
        fetchInitialData();
        // Ideally fetch courses here too or depend on department/level filter
    }, []);

    const fetchInitialData = async () => {
        try {
            const [sessRes, deptRes] = await Promise.all([
                api.get('/sessions'),
                api.get('/departments')
            ]);
            setSessions(sessRes.data.data.map(s => ({ value: s.name, label: s.name })));
            setDepartments(deptRes.data.data);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    useEffect(() => {
        if (filters.session && filters.semester) {
            fetchResults();
        }
    }, [filters]);


    const fetchResults = async () => {
        setLoading(true);
        try {
            // Assuming a general results endpoint with filters
            const res = await api.get('/results', { params: filters });
            setResults(res.data.data);
        } catch (error) {
            console.error(error);
            alert('Failed to load results');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePublish = async () => {
        if (selectedResults.length === 0) return;
        if (!window.confirm(`Are you sure you want to publish ${selectedResults.length} results?`)) return;

        try {
            await api.post('/results/publish', { resultIds: selectedResults });
            alert('Results published successfully');
            fetchResults();
            setSelectedResults([]);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to publish results');
        }
    };

    const handleOverride = async (e) => {
        e.preventDefault();
        try {
            await api.post('/results/override-grade', {
                resultId: overrideData.resultId,
                score: parseFloat(overrideData.newScore),
                reason: overrideData.reason
            });
            alert('Grade overridden successfully');
            setShowOverrideModal(false);
            fetchResults();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to override grade');
        }
    };

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            // Filter only publishable results (e.g., hod_approved or submitted if no hod required)
            const publishable = results.filter(r => ['submitted', 'hod_approved'].includes(r.status));
            setSelectedResults(publishable.map(r => r._id));
        } else {
            setSelectedResults([]);
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedResults(prev =>
            prev.includes(id) ? prev.filter(rx => rx !== id) : [...prev, id]
        );
    };

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <h1 style={titleStyles}>Result Oversight</h1>
                <p style={{ color: '#6b7280' }}>Review, approve, and publish student results</p>
            </div>

            <Card>
                <div style={filtersStyles}>
                    <Select
                        name="session"
                        value={filters.session}
                        onChange={handleFilterChange}
                        options={sessions}
                        placeholder="Select Session"
                    />
                    <Select
                        name="semester"
                        value={filters.semester}
                        onChange={handleFilterChange}
                        options={[
                            { value: 'First', label: 'First Semester' },
                            { value: 'Second', label: 'Second Semester' }
                        ]}
                        placeholder="Select Semester"
                    />
                    <Select
                        name="department"
                        value={filters.department}
                        onChange={handleFilterChange}
                        options={[
                            { value: '', label: 'All Departments' },
                            ...departments.map(d => ({ value: d.name, label: d.name }))
                        ]}
                    />
                    <Select
                        name="level"
                        value={filters.level}
                        onChange={handleFilterChange}
                        options={[
                            { value: '', label: 'All Levels' },
                            { value: '100', label: '100 Level' },
                            { value: '200', label: '200 Level' },
                            { value: '300', label: '300 Level' },
                            { value: '400', label: '400 Level' }
                        ]}
                    />
                </div>

                <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                    <Button onClick={fetchResults} disabled={!filters.session || !filters.semester}>
                        Load Results
                    </Button>
                    <Button
                        variant="success"
                        onClick={handlePublish}
                        disabled={selectedResults.length === 0}
                    >
                        Publish Selected ({selectedResults.length})
                    </Button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyles}>
                        <thead>
                            <tr>
                                <th style={thStyles}>
                                    <input type="checkbox" onChange={toggleSelectAll} />
                                </th>
                                <th style={thStyles}>Student</th>
                                <th style={thStyles}>Course</th>
                                <th style={thStyles}>Score</th>
                                <th style={thStyles}>Grade</th>
                                <th style={thStyles}>Status</th>
                                <th style={thStyles}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{ ...tdStyles, textAlign: 'center' }}>Loading...</td></tr>
                            ) : results.length === 0 ? (
                                <tr><td colSpan="7" style={{ ...tdStyles, textAlign: 'center' }}>No results found</td></tr>
                            ) : (
                                results.map(result => (
                                    <tr key={result._id}>
                                        <td style={tdStyles}>
                                            <input
                                                type="checkbox"
                                                checked={selectedResults.includes(result._id)}
                                                onChange={() => toggleSelectOne(result._id)}
                                                disabled={result.status === 'published'}
                                            />
                                        </td>
                                        <td style={tdStyles}>
                                            <div style={{ fontWeight: '500' }}>{result.studentId?.matricNumber}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{result.studentId?.userId?.name}</div>
                                        </td>
                                        <td style={tdStyles}>
                                            <div style={{ fontWeight: '500' }}>{result.courseId?.courseCode}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{result.courseId?.title}</div>
                                        </td>
                                        <td style={tdStyles}>{result.totalScore}</td>
                                        <td style={{ ...tdStyles, fontWeight: 'bold' }}>{result.grade}</td>
                                        <td style={tdStyles}>{statusBadge(result.status)}</td>
                                        <td style={tdStyles}>
                                            <Button
                                                size="small"
                                                variant="warning"
                                                onClick={() => {
                                                    setOverrideData({ resultId: result._id, newScore: result.totalScore, reason: '' });
                                                    setShowOverrideModal(true);
                                                }}
                                            >
                                                Override
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={showOverrideModal}
                onClose={() => setShowOverrideModal(false)}
                title="Override Result Grade"
            >
                <form onSubmit={handleOverride}>
                    <Input
                        label="New Total Score"
                        type="number"
                        value={overrideData.newScore}
                        onChange={(e) => setOverrideData({ ...overrideData, newScore: e.target.value })}
                        min="0"
                        max="100"
                        required
                    />
                    <Input
                        label="Reason for Override"
                        value={overrideData.reason}
                        onChange={(e) => setOverrideData({ ...overrideData, reason: e.target.value })}
                        placeholder="e.g. Script remarking, Error in calculation"
                        required
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                        <Button variant="secondary" onClick={() => setShowOverrideModal(false)}>Cancel</Button>
                        <Button type="submit" variant="warning">Apply Override</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ResultOversight;
