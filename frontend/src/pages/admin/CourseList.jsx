import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';

const CourseList = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        department: '',
        level: '',
        semester: ''
    });
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [departments, setDepartments] = useState([]);

    const containerStyles = {
        padding: '24px',
        maxWidth: '1400px',
        margin: '0 auto'
    };

    const headerStyles = { marginBottom: '32px' };
    const titleStyles = { fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' };
    const subtitleStyles = { fontSize: '16px', color: '#6b7280' };
    const actionsBarStyles = { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' };
    const filtersStyles = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' };
    const tableStyles = { width: '100%', borderCollapse: 'collapse' };
    const thStyles = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', fontSize: '14px', fontWeight: '600', color: '#374151', backgroundColor: '#f9fafb' };
    const tdStyles = { padding: '16px 12px', borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#111827' };
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
        fetchCourses();
    }, [filters, pagination.page]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const params = {
                ...filters,
                page: pagination.page,
                limit: 20
            };
            const response = await api.get('/courses', { params });
            setCourses(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching courses:', error);
            alert('Failed to load courses');
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
            await api.delete(`/courses/${selectedCourse._id}`);
            alert('Course deleted successfully');
            setShowDeleteModal(false);
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            alert(error.response?.data?.message || 'Failed to delete course');
        }
    };

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <h1 style={titleStyles}>Course Management</h1>
                <p style={subtitleStyles}>Manage academic courses and lecturer assignments</p>
            </div>

            <div style={actionsBarStyles}>
                <Button onClick={() => navigate('/admin/courses/create')}>
                    + Add New Course
                </Button>
            </div>

            <Card>
                <div style={filtersStyles}>
                    <Input
                        name="search"
                        placeholder="Search by code or title..."
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
                        name="semester"
                        value={filters.semester}
                        onChange={handleFilterChange}
                        options={[
                            { value: '', label: 'All Semesters' },
                            { value: 'First', label: 'First Semester' },
                            { value: 'Second', label: 'Second Semester' }
                        ]}
                    />
                </div>

                {loading ? (
                    <div style={loadingStyles}>Loading courses...</div>
                ) : courses.length === 0 ? (
                    <div style={emptyStyles}>
                        <p style={{ fontSize: '18px', marginBottom: '8px' }}>No courses found</p>
                        <p>Try adjusting your filters or create a new course</p>
                    </div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={tableStyles}>
                                <thead>
                                    <tr>
                                        <th style={thStyles}>Code</th>
                                        <th style={thStyles}>Title</th>
                                        <th style={thStyles}>Unit</th>
                                        <th style={thStyles}>Department</th>
                                        <th style={thStyles}>Level</th>
                                        <th style={thStyles}>Semester</th>
                                        <th style={thStyles}>Lecturer</th>
                                        <th style={thStyles}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map(course => (
                                        <tr key={course._id}>
                                            <td style={{ ...tdStyles, fontWeight: '600' }}>{course.courseCode}</td>
                                            <td style={tdStyles}>{course.title}</td>
                                            <td style={tdStyles}>{course.creditUnit}</td>
                                            <td style={tdStyles}>{course.department}</td>
                                            <td style={tdStyles}>{course.level}</td>
                                            <td style={tdStyles}>{course.semester}</td>
                                            <td style={tdStyles}>{course.lecturerId?.name || 'Unassigned'}</td>
                                            <td style={tdStyles}>
                                                <Button
                                                    size="small"
                                                    variant="secondary"
                                                    onClick={() => navigate(`/admin/courses/edit/${course._id}`)}
                                                    style={{ marginRight: '8px' }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="danger"
                                                    onClick={() => {
                                                        setSelectedCourse(course);
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
                title="Delete Course"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete Course
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to delete <strong>{selectedCourse?.courseCode} - {selectedCourse?.title}</strong>?</p>
                <p style={{ color: '#ef4444', marginTop: '12px' }}>
                    This will prevent new registrations but existing results may be preserved.
                </p>
            </Modal>
        </div>
    );
};

export default CourseList;
