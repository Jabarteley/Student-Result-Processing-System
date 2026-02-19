import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';

const StudentList = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        department: '',
        level: '',
        status: ''
    });
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [departments, setDepartments] = useState([]);

    // Styles reused from UserList for consistency
    const containerStyles = {
        padding: '24px',
        maxWidth: '1400px',
        margin: '0 auto'
    };

    const headerStyles = {
        marginBottom: '32px'
    };

    const titleStyles = {
        fontSize: '28px',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '8px'
    };

    const subtitleStyles = {
        fontSize: '16px',
        color: '#6b7280'
    };

    const actionsBarStyles = {
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
    };

    const filtersStyles = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
    };

    const tableStyles = { width: '100%', borderCollapse: 'collapse' };
    const thStyles = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', fontSize: '14px', fontWeight: '600', color: '#374151', backgroundColor: '#f9fafb' };
    const tdStyles = { padding: '16px 12px', borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#111827' };

    const badgeStyles = (status) => ({
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: status === 'active' ? '#d1fae5' : status === 'graduated' ? '#dbeafe' : '#fee2e2',
        color: status === 'active' ? '#065f46' : status === 'graduated' ? '#1e40af' : '#991b1b'
    });

    const paginationStyles = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '24px' };
    const loadingStyles = { textAlign: 'center', padding: '40px', fontSize: '16px', color: '#6b7280' };
    const emptyStyles = { textAlign: 'center', padding: '60px 20px', color: '#6b7280' };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments');
            setDepartments(response.data.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [filters, pagination.page]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const params = {
                ...filters,
                page: pagination.page,
                limit: 20
            };
            const response = await api.get('/students', { params });
            setStudents(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching students:', error);
            alert('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/students/${selectedStudent._id}`);
            alert('Student deleted successfully');
            setShowDeleteModal(false);
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
            alert(error.response?.data?.message || 'Failed to delete student');
        }
    };

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <h1 style={titleStyles}>Student Management</h1>
                <p style={subtitleStyles}>Manage student records and academic progress</p>
            </div>

            <div style={actionsBarStyles}>
                <Button onClick={() => navigate('/admin/students/create')}>
                    + Register New Student
                </Button>
            </div>

            <Card>
                <div style={filtersStyles}>
                    <Input
                        name="search"
                        placeholder="Search by matric number or name..."
                        value={filters.search}
                        onChange={handleFilterChange}
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
                    <Select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        options={[
                            { value: '', label: 'All Status' },
                            { value: 'active', label: 'Active' },
                            { value: 'graduated', label: 'Graduated' },
                            { value: 'suspended', label: 'Suspended' },
                            { value: 'withdrawn', label: 'Withdrawn' }
                        ]}
                    />
                </div>

                {loading ? (
                    <div style={loadingStyles}>Loading students...</div>
                ) : students.length === 0 ? (
                    <div style={emptyStyles}>
                        <p style={{ fontSize: '18px', marginBottom: '8px' }}>No students found</p>
                        <p>Try adjusting your filters or register a new student</p>
                    </div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={tableStyles}>
                                <thead>
                                    <tr>
                                        <th style={thStyles}>Matric Number</th>
                                        <th style={thStyles}>Name</th>
                                        <th style={thStyles}>Department</th>
                                        <th style={thStyles}>Level</th>
                                        <th style={thStyles}>Status</th>
                                        <th style={thStyles}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student._id}>
                                            <td style={tdStyles}>{student.matricNumber}</td>
                                            <td style={tdStyles}>{student.userId?.name || 'Unknown'}</td>
                                            <td style={tdStyles}>{student.department}</td>
                                            <td style={tdStyles}>{student.level}</td>
                                            <td style={tdStyles}>
                                                <span style={badgeStyles(student.status)}>
                                                    {student.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={tdStyles}>
                                                <Button
                                                    size="small"
                                                    variant="outline"
                                                    onClick={() => navigate(`/admin/students/profile/${student._id}`)}
                                                    style={{ marginRight: '8px' }}
                                                >
                                                    View Profile
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="secondary"
                                                    onClick={() => navigate(`/admin/students/edit/${student._id}`)}
                                                    style={{ marginRight: '8px' }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="danger"
                                                    onClick={() => {
                                                        setSelectedStudent(student);
                                                        setShowDeleteModal(true);
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={paginationStyles}>
                            <Button
                                size="small"
                                variant="secondary"
                                disabled={pagination.page === 1}
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            >
                                Previous
                            </Button>
                            <span style={{ color: '#6b7280' }}>
                                Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                            </span>
                            <Button
                                size="small"
                                variant="secondary"
                                disabled={pagination.page === pagination.pages}
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}
            </Card>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Student"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete Student
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to delete student <strong>{selectedStudent?.userId?.name}</strong> ({selectedStudent?.matricNumber})?</p>
                <p style={{ color: '#ef4444', marginTop: '12px' }}>
                    This will also delete their academic records. This action cannot be undone.
                </p>
            </Modal>
        </div>
    );
};

export default StudentList;
