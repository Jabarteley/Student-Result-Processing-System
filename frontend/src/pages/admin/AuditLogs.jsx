import React, { useState, useEffect } from 'react';
// import api from '../../services/api'; // Assuming audit log endpoint exists
import Card from '../../components/common/Card';

const AuditLogs = () => {
    // Mock data for now as audit endpoint wasn't strictly built yet
    const logs = [
        { id: 1, user: 'Admin User', action: 'PUBLISH_RESULTS', details: 'Published 45 results for CSC101', date: '2026-02-18 10:30 AM' },
        { id: 2, user: 'Dr. Smith (HOD)', action: 'APPROVE_RESULTS', details: 'Approved PHY202 results', date: '2026-02-18 09:15 AM' },
        { id: 3, user: 'Admin User', action: 'CREATE_USER', details: 'Created user John Doe', date: '2026-02-17 04:45 PM' },
    ];

    const containerStyles = { padding: '24px', maxWidth: '1200px', margin: '0 auto' };
    const tableStyles = { width: '100%', borderCollapse: 'collapse' };
    const thStyles = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' };
    const tdStyles = { padding: '14px 12px', borderBottom: '1px solid #e5e7eb', fontSize: '14px' };

    return (
        <div style={containerStyles}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Audit Logs</h1>

            <Card>
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
                            <tr key={log.id}>
                                <td style={tdStyles}>{log.date}</td>
                                <td style={tdStyles}>{log.user}</td>
                                <td style={{ ...tdStyles, fontWeight: '600', color: '#4f46e5' }}>{log.action}</td>
                                <td style={tdStyles}>{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default AuditLogs;
