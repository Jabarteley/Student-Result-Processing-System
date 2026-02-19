import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';

const UserList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        role: '',
        department: '',
        status: ''
    });
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [departments, setDepartments] = useState([]);

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

    const tableStyles = {
        width: '100%',
        borderCollapse: 'collapse'
    };

    const thStyles = {
        padding: '12px',
        textAlign: 'left',
        borderBottom: '2px solid #e5e7eb',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        backgroundColor: '#f9fafb'
    };

    const tdStyles = {
        padding: '16px 12px',
        borderBottom: '1px solid #e5e7eb',
        fontSize: '14px',
        color: '#111827'
    };

    const badgeStyles = (status) => ({
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: status === 'active' ? '#d1fae5' : '#fee2e2',
        color: status === 'active' ? '#065f46' : '#991b1b'
    });

    const roleColors = {
        admin: '#8b5cf6',
        hod: '#3b82f6',
        lecturer: '#10b981',
        student: '#f59e0b'
    };

    const roleBadgeStyles = (role) => ({
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: `${roleColors[role]}20`,
        color: roleColors[role]
    });

    const actionButtonStyles = {
        padding: '6px 12px',
        fontSize: '13px',
        marginRight: '8px'
    };

    const paginationStyles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        marginTop: '24px'
    };

    const loadingStyles = {
        textAlign: 'center',
        padding: '40px',
        fontSize: '16px',
        color: '#6b7280'
    };

    const emptyStyles = {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#6b7280'
    };

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get('/departments');
                setDepartments(response.data.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [filters, pagination.page]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = {
                ...filters,
                page: pagination.page,
                limit: 20
            };
            const response = await api.get('/users', { params });
            setUsers(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to load users');
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
            await api.delete(`/users/${selectedUser._id}`);
            alert('User deleted successfully');
            setShowDeleteModal(false);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        try {
            await api.post(`/users/${selectedUser._id}/reset-password`, { newPassword });
            alert('Password reset successfully');
            setShowResetModal(false);
            setNewPassword('');
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('Failed to reset password');
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            const endpoint = user.isActive ? 'deactivate' : 'activate';
            await api.put(`/users/${user._id}/${endpoint}`);
            alert(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
            fetchUsers();
        } catch (error) {
            console.error('Error toggling user status:', error);
            alert('Failed to update user status');
        }
    };

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <h1 style={titleStyles}>User Management</h1>
                <p style={subtitleStyles}>Manage system users and their roles</p>
            </div>

            <div style={actionsBarStyles}>
                <Button onClick={() => navigate('/admin/users/create')}>
                    + Create New User
                </Button>
            </div>

            <Card>
                <div style={filtersStyles}>
                    <Input
                        name="search"
                        placeholder="Search by name or email..."
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                    <Select
                        name="role"
                        value={filters.role}
                        onChange={handleFilterChange}
                        options={[
                            { value: '', label: 'All Roles' },
                            { value: 'admin', label: 'Admin' },
                            { value: 'hod', label: 'HOD' },
                            { value: 'lecturer', label: 'Lecturer' },
                            { value: 'student', label: 'Student' }
                        ]}
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
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        options={[
                            { value: '', label: 'All Status' },
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' }
                        ]}
                    />
                </div>

                {loading ? (
                    <div style={loadingStyles}>Loading users...</div>
                ) : users.length === 0 ? (
                    <div style={emptyStyles}>
                        <p style={{ fontSize: '18px', marginBottom: '8px' }}>No users found</p>
                        <p>Try adjusting your filters or create a new user</p>
                    </div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={tableStyles}>
                                <thead>
                                    <tr>
                                        <th style={thStyles}>Name</th>
                                        <th style={thStyles}>Email</th>
                                        <th style={thStyles}>Role</th>
                                        <th style={thStyles}>Department</th>
                                        <th style={thStyles}>Status</th>
                                        <th style={thStyles}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td style={tdStyles}>{user.name}</td>
                                            <td style={tdStyles}>{user.email}</td>
                                            <td style={tdStyles}>
                                                <span style={roleBadgeStyles(user.role)}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={tdStyles}>{user.department || 'N/A'}</td>
                                            <td style={tdStyles}>
                                                <span style={badgeStyles(user.isActive ? 'active' : 'inactive')}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td style={tdStyles}>
                                                <Button
                                                    size="small"
                                                    variant="outline"
                                                    onClick={() => navigate(`/admin/users/edit/${user._id}`)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="warning"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowResetModal(true);
                                                    }}
                                                >
                                                    Reset Password
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="secondary"
                                                    onClick={() => handleToggleStatus(user)}
                                                >
                                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="danger"
                                                    onClick={() => {
                                                        setSelectedUser(user);
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

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete User"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete User
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to delete <strong>{selectedUser?.name}</strong>?</p>
                <p style={{ color: '#ef4444', marginTop: '12px' }}>This action cannot be undone.</p>
            </Modal>

            {/* Reset Password Modal */}
            <Modal
                isOpen={showResetModal}
                onClose={() => {
                    setShowResetModal(false);
                    setNewPassword('');
                }}
                title="Reset Password"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => {
                            setShowResetModal(false);
                            setNewPassword('');
                        }}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleResetPassword}>
                            Reset Password
                        </Button>
                    </>
                }
            >
                <p style={{ marginBottom: '16px' }}>
                    Reset password for <strong>{selectedUser?.name}</strong>
                </p>
                <Input
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    required
                />
            </Modal>
        </div>
    );
};

export default UserList;
