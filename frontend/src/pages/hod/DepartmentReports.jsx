import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../services/api'

const DepartmentReports = () => {
    const [sessions, setSessions] = useState([]);
    const [filters, setFilters] = useState({ session: '', semester: 'First' });
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await api.get('/sessions');
                const sessionData = response.data.data;
                setSessions(sessionData);
                if (sessionData.length > 0) {
                    setFilters(prev => ({ ...prev, session: sessionData[0].name }));
                }
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };
        fetchSessions();
    }, []);

    const fetchReports = async () => {
        if (!filters.session) return;
        setLoading(true);
        try {
            const { session, semester } = filters;
            const response = await api.get(`/hod/department-report?session=${session}&semester=${semester}`);

            if (response.data && response.data.success) {
                setReportData(response.data.data);
            } else {
                setReportData(null);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            setReportData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        fetchReports();
    };

    useEffect(() => {
        if (filters.session) {
            fetchReports();
        }
    }, [filters.session]);
    // Re-fetch reports when the session filter changes

    // Placeholder for analytics similar to Admin Reports but scoped to Dept
    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Department Reports</h1>
            <Card>
                <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div>
                        <label htmlFor="session" style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Session</label>
                        <select
                            id="session"
                            name="session"
                            value={filters.session}
                            onChange={handleFilterChange}
                            style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        >
                            {sessions.map(s => (
                                <option key={s._id} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="semester" style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Semester</label>
                        <select
                            id="semester"
                            name="semester"
                            value={filters.semester}
                            onChange={handleFilterChange}
                            style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        >
                            <option value="First">First</option>
                            <option value="Second">Second</option>
                        </select>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <Button onClick={applyFilters}>Generate Report</Button>
                        </div>
                    </div>
                    <Button onClick={applyFilters} disabled={loading}>
                        {loading ? 'Loading...' : 'Apply Filters'}
                    </Button>
                </div>

                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                    {loading && <p>Loading department reports...</p>}
                    {!loading && reportData ? (
                        <>
                            <p style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>Reports for Session: {filters.session}, Semester: {filters.semester}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                                <Card>
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Results</div>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{reportData.totalResults || 0}</div>
                                    </div>
                                </Card>
                                <Card>
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Average GP</div>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{reportData.averageGradePoint || 0}</div>
                                    </div>
                                </Card>
                                <Card>
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Pass Rate</div>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{reportData.passRate || '0%'}</div>
                                    </div>
                                </Card>
                                <Card>
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <div style={{ fontSize: '14px', color: '#6b7280' }}>Courses</div>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{reportData.totalCourses || 0}</div>
                                    </div>
                                </Card>
                            </div>

                            <Card title="Course Performance">
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Course Code</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Results Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.courses?.map((course, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={{ padding: '12px' }}>{course.courseCode}</td>
                                                <td style={{ padding: '12px' }}>{course.title}</td>
                                                <td style={{ padding: '12px' }}>{course.resultsCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </>
                    ) : !loading && (
                        <>
                            <p>Departmental performance analytics will be displayed here.</p>
                            <p style={{ marginTop: '16px' }}>Features to include:</p>
                            <ul style={{ listStyle: 'none', padding: 0, marginTop: '8px' }}>
                                <li>Course Pass Rates</li>
                                <li>Average GPA Trend</li>
                                <li>Lecturer Performance Metrics</li>
                                <li>Student At-Risk List</li>
                            </ul>
                        </>
                    )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '24px' }}>
                    <Button>Generate Summary PDF</Button>
                </div>
            </Card>
        </div>
    );
};

export default DepartmentReports;
