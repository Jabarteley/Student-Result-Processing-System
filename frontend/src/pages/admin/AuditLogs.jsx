import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await api.get('/audit-logs');
            if (response.data && response.data.success) {
                setLogs(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const containerStyles = { padding: '24px', maxWidth: '1200px', margin: '0 auto' };
    const tableStyles = { width: '100%', borderCollapse: 'collapse' };
    const thStyles = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' };
    const tdStyles = { padding: '14px 12px', borderBottom: '1px solid #e5e7eb', fontSize: '14px' };

    return (
        <div style={containerStyles}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Audit Logs</h1>

            <Card>
                {loading ? (
                    <p style={{ padding: '20px', textAlign: 'center' }}>Loading audit logs...</p>
                ) : logs.length === 0 ? (
                    <p style={{ padding: '20px', textAlign: 'center' }}>No audit logs found.</p>
                ) : (
                    <table style={tableStyles}>
                        <thead>
                            <tr>
                                <th style={thStyles}>Date/Time</th>
                                <th style={thStyles}>User</th>
                                <th style={thStyles}>Action</th>
                                <th style={thStyles}>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log._id}>
                                    <td style={tdStyles}>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td style={tdStyles}>
                                        {log.userId ? (
                                            <div>
                                                <div style={{ fontWeight: '500' }}>{log.userId.name}</div>
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{log.userId.email}</div>
                                            </div>
                                        ) : 'System/Unknown'}
                                    </td>
                                    <td style={{ ...tdStyles, fontWeight: '600', color: '#4f46e5' }}>{log.action}</td>
                                    <td style={tdStyles}>{log.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>
        </div>
    );
};

export default AuditLogs;
