import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const ScoreUpload = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scores, setScores] = useState({}); // { studentId: { ca: 0, exam: 0 } }
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');

    const containerStyles = { padding: '24px', maxWidth: '1200px', margin: '0 auto' };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                // Fetch sessions and course metadata in parallel
                const [sessionRes, courseRes] = await Promise.all([
                    api.get('/sessions'),
                    api.get(`/courses/${courseId}`)
                ]);

                const sessionData = sessionRes.data.data.map(s => ({ value: s.name, label: s.name }));
                setSessions(sessionData);

                const courseData = courseRes.data.data;
                setCourse(courseData);

                // Set initial session (latest)
                if (sessionData.length > 0) {
                    setSelectedSession(sessionData[0].value);
                }

                // Set initial semester (from course)
                setSelectedSemester(courseData.semester);

            } catch (error) {
                console.error('Error initializing metadata:', error);
                setLoading(false);
            }
        };
        init();
    }, [courseId]);

    useEffect(() => {
        if (selectedSession && selectedSemester) {
            fetchStudents();
        }
    }, [selectedSession, selectedSemester]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            // 1. Fetch all students in course's department and level
            const enrollmentRes = await api.get(`/courses/${courseId}/students`);
            const enrolledStudents = enrollmentRes.data.data;

            // 2. Fetch any existing results for this course/session/semester
            const resultsRes = await api.get(`/results`, {
                params: {
                    courseId,
                    session: selectedSession,
                    semester: selectedSemester
                }
            });
            const existingResults = resultsRes.data.data;

            // 3. Merge: Match students with their results
            const mergedStudents = enrolledStudents.map(student => {
                const result = existingResults.find(r =>
                    (r.studentId._id || r.studentId).toString() === student._id.toString()
                );
                return {
                    _id: result ? result._id : `temp-${student._id}`,
                    studentId: student,
                    CA: result ? result.CA : 0,
                    exam: result ? result.exam : 0,
                    total: result ? result.total : 0,
                    grade: result ? result.grade : 'F',
                    status: result ? result.status : 'draft',
                    rejectionReason: result ? result.rejectionReason : ''
                };
            });

            setStudents(mergedStudents);

            const initialScores = {};
            mergedStudents.forEach(s => {
                initialScores[s.studentId._id] = {
                    caScore: s.CA || 0,
                    examScore: s.exam || 0,
                    totalScore: s.total || 0,
                    grade: s.grade || 'F',
                    status: s.status || 'draft',
                    rejectionReason: s.rejectionReason || ''
                };
            });
            setScores(initialScores);

        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleScoreChange = (studentId, type, value) => {
        const numValue = parseFloat(value) || 0;
        setScores(prev => {
            const current = prev[studentId] || {};
            const newCA = type === 'caScore' ? numValue : (current.caScore || 0);
            const newExam = type === 'examScore' ? numValue : (current.examScore || 0);
            const total = newCA + newExam;

            // Simple frontend grade calculation (will be recalculated by backend)
            let grade = 'F';
            if (total >= 70) grade = 'A';
            else if (total >= 60) grade = 'B';
            else if (total >= 50) grade = 'C';
            else if (total >= 45) grade = 'D';
            else if (total >= 40) grade = 'E';

            return {
                ...prev,
                [studentId]: {
                    ...current,
                    [type]: numValue,
                    totalScore: total,
                    grade: grade
                }
            };
        });
    };

    const handleSave = async (submit = false) => {
        try {
            const payload = {
                courseId,
                session: selectedSession,
                semester: selectedSemester,
                scores: Object.entries(scores).map(([studentId, score]) => ({
                    studentId,
                    caScore: score.caScore,
                    examScore: score.examScore
                })),
                submit
            };

            await api.post('/results/bulk-update', payload);
            alert(submit ? 'Results submitted for approval' : 'Scores saved successfully');
            if (submit) navigate('/lecturer/courses');
            else fetchResults(); // Refresh with new data
        } catch (error) {
            console.error('Save failed:', error);
            alert(error.response?.data?.message || 'Failed to save scores');
        }
    };

    if (loading && !course) return <div style={containerStyles}>Loading...</div>;

    return (
        <div style={containerStyles}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{course?.courseCode}: {course?.title}</h1>
                    <p style={{ color: '#6b7280' }}>Upload/Edit Scores</p>
                </div>
            </div>

            <div style={{ marginBottom: '24px', display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <Select
                        label="Session"
                        value={selectedSession}
                        onChange={(e) => setSelectedSession(e.target.value)}
                        options={sessions}
                    />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <Select
                        label="Semester"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        options={[
                            { value: 'First', label: 'First Semester' },
                            { value: 'Second', label: 'Second Semester' }
                        ]}
                    />
                </div>
                <div style={{ flex: 2, textAlign: 'right', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <Button variant="outline" onClick={() => navigate(`/lecturer/upload-bulk/${courseId}`)}>
                        CSV Upload
                    </Button>
                    <Button onClick={() => handleSave(false)}>Save Draft</Button>
                    <Button variant="success" onClick={() => handleSave(true)}>Submit Results</Button>
                </div>
            </div>

            <Card>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>Loading students...</div>
                ) : students.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Matric No</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Name</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>CA (30)</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Exam (70)</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Total</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(record => {
                                const studentId = record.studentId._id;
                                const score = scores[studentId] || { caScore: 0, examScore: 0, totalScore: 0, grade: 'F', status: 'draft', rejectionReason: '' };
                                const isInputDisabled = ['submitted', 'hod_approved', 'published'].includes(score.status);

                                return (
                                    <tr key={studentId} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '12px' }}>{record.studentId.matricNumber}</td>
                                        <td style={{ padding: '12px' }}>{record.studentId.userId?.name || 'N/A'}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                backgroundColor:
                                                    score.status === 'submitted' ? '#e0f2fe' :
                                                        score.status === 'hod_approved' ? '#dcfce7' :
                                                            score.status === 'rejected' ? '#fee2e2' : '#f3f4f6',
                                                color:
                                                    score.status === 'submitted' ? '#0369a1' :
                                                        score.status === 'hod_approved' ? '#15803d' :
                                                            score.status === 'rejected' ? '#b91c1c' : '#374151'
                                            }}>
                                                {score.status?.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase()) || 'Draft'}
                                            </span>
                                            {score.status === 'rejected' && score.rejectionReason && (
                                                <div style={{ fontSize: '11px', color: '#b91c1c', marginTop: '4px', maxWidth: '150px' }}>
                                                    Reason: {score.rejectionReason}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <input
                                                type="number"
                                                min="0" max="30"
                                                value={score.caScore}
                                                onChange={(e) => handleScoreChange(studentId, 'caScore', e.target.value)}
                                                style={{ width: '60px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                                                disabled={isInputDisabled}
                                            />
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <input
                                                type="number"
                                                min="0" max="70"
                                                value={score.examScore}
                                                onChange={(e) => handleScoreChange(studentId, 'examScore', e.target.value)}
                                                style={{ width: '60px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                                                disabled={isInputDisabled}
                                            />
                                        </td>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{score.totalScore}</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold', color: score.grade === 'F' ? 'red' : 'green' }}>{score.grade}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                        No students enrolled in this course for the selected department/level.
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ScoreUpload;
