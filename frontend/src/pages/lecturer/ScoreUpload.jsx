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
                const result = existingResults.find(r => r.studentId._id === student._id);
                return {
                    _id: result ? result._id : `temp-${student._id}`,
                    studentId: student,
                    CA: result ? result.CA : 0,
                    exam: result ? result.exam : 0,
                    status: result ? result.status : 'draft'
                };
            });

            setStudents(mergedStudents);

            const initialScores = {};
            mergedStudents.forEach(s => {
                initialScores[s.studentId._id] = {
                    ca: s.CA || 0,
                    exam: s.exam || 0
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
                session: selectedSession,
                semester: selectedSemester,
                scores: Object.entries(scores).map(([studentId, score]) => ({
                    studentId,
                    caScore: score.ca,
                    examScore: score.exam
                })),
                submit
            };

            await api.post('/results/bulk-update', payload);
            alert(submit ? 'Results submitted for approval' : 'Scores saved successfully');
            if (submit) navigate('/lecturer/courses');
        } catch (error) {
            alert('Failed to save scores');
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
                                <th style={{ textAlign: 'left', padding: '12px' }}>CA (30)</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Exam (70)</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Total</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(record => {
                                const score = scores[record.studentId._id] || { ca: 0, exam: 0 };
                                const total = score.ca + score.exam;
                                let grade = 'F';
                                if (total >= 70) grade = 'A';
                                else if (total >= 60) grade = 'B';
                                else if (total >= 50) grade = 'C';
                                else if (total >= 45) grade = 'D';
                                else if (total >= 40) grade = 'E';

                                return (
                                    <tr key={record._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '12px' }}>{record.studentId.matricNumber}</td>
                                        <td style={{ padding: '12px' }}>{record.studentId.userId?.name || 'N/A'}</td>
                                        <td style={{ padding: '12px' }}>
                                            <input
                                                type="number"
                                                min="0" max="30"
                                                value={score.ca}
                                                onChange={(e) => handleScoreChange(record.studentId._id, 'ca', e.target.value)}
                                                style={{ width: '60px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                                            />
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <input
                                                type="number"
                                                min="0" max="70"
                                                value={score.exam}
                                                onChange={(e) => handleScoreChange(record.studentId._id, 'exam', e.target.value)}
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
