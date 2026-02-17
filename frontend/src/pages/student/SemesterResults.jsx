import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';

const SemesterResults = () => {
    const [selectedSession, setSelectedSession] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [results, setResults] = useState([]);
    const [gpa, setGpa] = useState(0.00);
    const [loading, setLoading] = useState(false);

    // Mock sessions for now
    const sessions = [
        { value: '2023/2024', label: '2023/2024' },
        { value: '2022/2023', label: '2022/2023' }
    ];

    const fetchResults = async () => {
        if (!selectedSession || !selectedSemester) {
            alert('Please select session and semester');
            return;
        }

        setLoading(true);
        try {
            // endpoint: /results/my-results?session=...&semester=...
            // Mock data
            setResults([
                { courseCode: 'CSC301', title: 'Data Structures', unit: 3, score: 78, grade: 'A', point: 5 },
                { courseCode: 'CSC302', title: 'Operating Systems', unit: 3, score: 65, grade: 'B', point: 4 },
                { courseCode: 'GNS301', title: 'Entreprenuership', unit: 2, score: 82, grade: 'A', point: 5 },
                { courseCode: 'MTH301', title: 'Numerical Analysis', unit: 3, score: 55, grade: 'C', point: 3 }
            ]);
            setGpa(4.27); // Mock calculation
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const tableStyles = { width: '100%', borderCollapse: 'collapse', marginTop: '24px' };
    const thStyles = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' };
    const tdStyles = { padding: '14px 12px', borderBottom: '1px solid #e5e7eb' };

    return (
        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Check Semester Result</h1>

            <Card>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', alignItems: 'end' }}>
                    <Select
                        label="Session"
                        value={selectedSession}
                        onChange={(e) => setSelectedSession(e.target.value)}
                        options={sessions}
                        placeholder="Select Session"
                    />
                    <Select
                        label="Semester"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        options={[
                            { value: 'First', label: 'First Semester' },
                            { value: 'Second', label: 'Second Semester' }
                        ]}
                        placeholder="Select Semester"
                    />
                    <Button onClick={fetchResults} disabled={loading}>
                        {loading ? 'Fetching...' : 'View Result'}
                    </Button>
                </div>

                {results.length > 0 && (
                    <div style={{ marginTop: '32px' }}>
                        <div style={{
                            padding: '16px',
                            backgroundColor: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                        }}>
                            <span style={{ fontWeight: '600', color: '#166534' }}>SEMESTER GPA</span>
                            <span style={{ fontSize: '24px', fontWeight: '800', color: '#15803d' }}>{gpa.toFixed(2)}</span>
                        </div>

                        <table style={tableStyles}>
                            <thead>
                                <tr>
                                    <th style={thStyles}>Course Code</th>
                                    <th style={thStyles}>Course Title</th>
                                    <th style={thStyles}>Unit</th>
                                    <th style={thStyles}>Score</th>
                                    <th style={thStyles}>Grade</th>
                                    <th style={thStyles}>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((res, idx) => (
                                    <tr key={idx}>
                                        <td style={{ ...tdStyles, fontWeight: '600' }}>{res.courseCode}</td>
                                        <td style={tdStyles}>{res.title}</td>
                                        <td style={tdStyles}>{res.unit}</td>
                                        <td style={tdStyles}>{res.score}</td>
                                        <td style={{ ...tdStyles, fontWeight: 'bold', color: res.grade === 'F' ? 'red' : 'inherit' }}>{res.grade}</td>
                                        <td style={tdStyles}>{res.point}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default SemesterResults;
