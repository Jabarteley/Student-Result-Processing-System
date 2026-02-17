import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select'; // Assuming we might select student if manual

const ScoreUpload = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scores, setScores] = useState({}); // { studentId: { ca: 0, exam: 0 } }

    const containerStyles = { padding: '24px', maxWidth: '1200px', margin: '0 auto' };

    useEffect(() => {
        fetchCourseAndStudents();
    }, [courseId]);

    const fetchCourseAndStudents = async () => {
        try {
            setLoading(true);
            const courseRes = await api.get(`/courses/${courseId}`);
            setCourse(courseRes.data.data);

            // Fetch students or results for this course
            // If results exist, pre-fill. If not, list students to enter.
            // Assuming endpoint to get students registered or result placeholders
            const resultsRes = await api.get(`/results`, { params: { courseId } });
            // If no results, we might need to fetch enrolled students and create placeholder rows
            // For now assume results returns empty or existing

            // Better approach: Get registered students (not implemented clearly in backend task yet)
            // or just use results if they are auto-created on registration.
            // Let's assume we can fetch students and map to results.

            // Temporary: fetch all students in department/level (not accurate but works for proto)
            // Or better, rely on existing results.
            setStudents(resultsRes.data.data); // This expects Result objects

            const initialScores = {};
            resultsRes.data.data.forEach(r => {
                initialScores[r.studentId._id] = {
                    ca: r.caScore || 0,
                    exam: r.examScore || 0
                };
            });
            setScores(initialScores);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleScoreChange = (studentId, type, value) => {
        setScores(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [type]: parseFloat(value) || 0
            }
        }));
    };

    const handleSave = async (submit = false) => {
        try {
            const payload = {
                courseId,
                scores: Object.entries(scores).map(([studentId, score]) => ({
                    studentId,
                    caScore: score.ca,
                    examScore: score.examScore
                })),
                submit // If true, change status to 'submitted'
            };

            await api.post('/results/bulk-update', payload); // New endpoint needed
            alert(submit ? 'Results submitted for approval' : 'Scores saved successfully');
            if (submit) navigate('/lecturer/courses');
        } catch (error) {
            alert('Failed to save scores');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={containerStyles}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{course?.courseCode}: {course?.title}</h1>
                    <p style={{ color: '#6b7280' }}>Upload/Edit Scores</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="outline" onClick={() => navigate(`/lecturer/upload-bulk/${courseId}`)}>
                        CSV Upload
                    </Button>
                    <Button onClick={() => handleSave(false)}>Save Draft</Button>
                    <Button variant="success" onClick={() => handleSave(true)}>Submit Results</Button>
                </div>
            </div>

            <Card>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '12px' }}>Matric No</th>
                            <th style={{ textAlign: 'left', padding: '12px' }}>Name</th>
                            <th style={{ textAlign: 'left', padding: '12px' }}>CA (30)</th>
                            <th style={{ textAlign: 'left', padding: '12px' }}>Exam (70)</th>
                            <th style={{ textAlign: 'left', padding: '12px' }}>Total</th>
                            <th style={{ textAlign: 'left', padding: '12px' }}>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(result => {
                            const score = scores[result.studentId._id] || { ca: 0, exam: 0 };
                            const total = score.ca + score.exam;
                            // Naive grade calc for preview
                            let grade = 'F';
                            if (total >= 70) grade = 'A';
                            else if (total >= 60) grade = 'B';
                            else if (total >= 50) grade = 'C';
                            else if (total >= 45) grade = 'D';
                            else if (total >= 40) grade = 'E';

                            return (
                                <tr key={result._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '12px' }}>{result.studentId.matricNumber}</td>
                                    <td style={{ padding: '12px' }}>{result.studentId.userId.name}</td>
                                    <td style={{ padding: '12px' }}>
                                        <input
                                            type="number"
                                            min="0" max="30"
                                            value={score.ca}
                                            onChange={(e) => handleScoreChange(result.studentId._id, 'ca', e.target.value)}
                                            style={{ width: '60px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                                        />
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <input
                                            type="number"
                                            min="0" max="70"
                                            value={score.examScore}
                                            onChange={(e) => handleScoreChange(result.studentId._id, 'examScore', e.target.value)}
                                            style={{ width: '60px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                                        />
                                    </td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{total}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold', color: grade === 'F' ? 'red' : 'green' }}>{grade}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default ScoreUpload;
