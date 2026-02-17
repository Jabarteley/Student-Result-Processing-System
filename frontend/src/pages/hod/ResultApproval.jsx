import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const ResultApproval = () => {
    const navigate = useNavigate();
    const [pendingResults, setPendingResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewDetails, setViewDetails] = useState(null); // Course ID to view details for
    const [courseScores, setCourseScores] = useState([]); // Scores for specific course
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            setLoading(true);
            const response = await api.get('/hod/pending-approvals');
            if (response.data && response.data.success) {
                const results = response.data.data;

                // Group results by course
                const grouped = results.reduce((acc, result) => {
                    const courseId = result.courseId?._id;
                    if (!acc[courseId]) {
                        acc[courseId] = {
                            courseId: courseId,
                            courseCode: result.courseId?.courseCode,
                            title: result.courseId?.title,
                            lecturer: result.submittedBy?.name || 'Unknown',
                            submittedDate: new Date(result.submittedAt).toLocaleDateString(),
                            count: 0
                        };
                    }
                    acc[courseId].count++;
                    return acc;
                }, {});

                setPendingResults(Object.values(grouped));
            }
        } catch (error) {
            console.error('Error fetching pending results:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleView = async (courseId) => {
        setSelectedCourseId(courseId);
        try {
            const response = await api.get(`/hod/pending-approvals?courseId=${courseId}`);
            if (response.data && response.data.success) {
                // The API returns a list of results. We need to map this to the format expected by the table if different
                // The table expects: student.matricNumber, caScore, examScore, totalScore, grade
                // The API result model has: studentId (populated with matricNumber), caScore, examScore, totalScore, grade
                // But wait, the backend `getPendingApprovals` populates `studentId` properly.

                const formattedScores = response.data.data.map(r => ({
                    _id: r._id,
                    student: { matricNumber: r.studentId?.matricNumber || 'N/A' },
                    caScore: r.caScore,
                    examScore: r.examScore,
                    totalScore: r.totalScore,
                    grade: r.grade
                }));
                setCourseScores(formattedScores);
            }
        } catch (error) {
            console.error('Error fetching course details:', error);
        }
        setViewDetails(courseId);
    };

    const handleApprove = async () => {
        if (!window.confirm('Approve all results for this course?')) return;
        try {
            await api.post('/hod/approve-result', { courseId: selectedCourseId });
            alert('Results approved successfully');
            setViewDetails(null);
            fetchPending();
        } catch (error) {
            alert('Approval failed'); // Mock API won't likely work yet
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }

        try {
            await api.post(`/hod/reject-result/${selectedCourseId}`, { reason: rejectReason });

            // Remove from list
            setPendingResults(prev => prev.filter(r => r.courseId !== selectedCourseId));
            setRejectModalOpen(false);
            setViewDetails(null);
            alert('Result rejected and returned to lecturer.');
        } catch (error) {
            console.error('Error rejecting result:', error);
            alert(error.response?.data?.message || 'Failed to reject result');
        }
    };

    if (viewDetails) {
        return (
            <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
                <Button variant="secondary" onClick={() => setViewDetails(null)} style={{ marginBottom: '16px' }}>&larr; Back to List</Button>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Review Results: {pendingResults.find(p => p.courseId === viewDetails)?.courseCode}</h1>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Button variant="danger" onClick={() => setRejectModalOpen(true)}>Reject</Button>
                        <Button variant="success" onClick={handleApprove}>Approve All</Button>
                    </div>
                </div>

                <Card>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Student</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>CA</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Exam</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Total</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseScores.map(score => (
                                <tr key={score._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '12px' }}>{score.student.matricNumber}</td>
                                    <td style={{ padding: '12px' }}>{score.caScore}</td>
                                    <td style={{ padding: '12px' }}>{score.examScore}</td>
                                    <td style={{ padding: '12px' }}>{score.totalScore}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{score.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                <Modal
                    isOpen={rejectModalOpen}
                    onClose={() => setRejectModalOpen(false)}
                    title="Reject Results"
                >
                    <form onSubmit={handleReject}>
                        <Input
                            label="Reason for Rejection"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="e.g. Too many failures, Errors detected..."
                            required
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                            <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="danger">Return to Lecturer</Button>
                        </div>
                    </form>
                </Modal>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Pending Result Approvals</h1>
            {pendingResults.length === 0 ? (
                <p>No results pending approval.</p>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {pendingResults.map(item => (
                        <Card key={item.courseId}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{item.courseCode} - {item.title}</h3>
                                    <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>Submitted by {item.lecturer} on {item.submittedDate}</p>
                                </div>
                                <Button onClick={() => handleView(item.courseId)}>Review</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResultApproval;
