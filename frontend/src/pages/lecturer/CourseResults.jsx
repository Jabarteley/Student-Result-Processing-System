import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const CourseResults = () => {
    // This could just reuse ScoreUpload in 'view-only' mode or be a separate view
    // For simplicity, let's make it a dashboard-like view of the course results stats
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ pass: 0, fail: 0, average: 0, total: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Mock stats or fetch real
                const res = await api.get(`/results`, { params: { courseId } });
                const results = res.data.data;
                const total = results.length;
                const pass = results.filter(r => r.grade !== 'F').length;
                const fail = total - pass;
                const avg = total ? results.reduce((acc, r) => acc + (r.total || 0), 0) / total : 0;

                setStats({ total, pass, fail, average: avg.toFixed(1) });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [courseId]);

    return (
        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Course Result Summary</h1>
                <Button onClick={() => navigate(`/lecturer/upload-scores/${courseId}`)}>Edit Scores</Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4f46e5' }}>{stats.total}</div>
                        <div style={{ color: '#6b7280' }}>Total Students</div>
                    </div>
                </Card>
                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>{stats.pass}</div>
                        <div style={{ color: '#6b7280' }}>Passed</div>
                    </div>
                </Card>
                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ef4444' }}>{stats.fail}</div>
                        <div style={{ color: '#6b7280' }}>Failed</div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CourseResults;
