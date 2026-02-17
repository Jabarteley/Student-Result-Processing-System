import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';

const LecturerManagement = () => {
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLecturers();
    }, []);

    const fetchLecturers = async () => {
        try {
            const response = await api.get('/hod/lecturers');
            if (response.data && response.data.success) {
                setLecturers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching lecturers:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Phone Number', accessor: 'phoneNumber' },
        { header: 'Assigned Courses', accessor: 'courseCount' },
        {
            header: 'Joined Date',
            accessor: (row) => new Date(row.createdAt).toLocaleDateString()
        }
    ];

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Department Lecturers</h1>
            <Card>
                <DataTable
                    columns={columns}
                    data={lecturers}
                    loading={loading}
                    emptyMessage="No lecturers found in this department."
                />
            </Card>
        </div>
    );
};

export default LecturerManagement;
