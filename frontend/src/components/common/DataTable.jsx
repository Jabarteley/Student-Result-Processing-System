import React from 'react';
import Button from './Button';

const DataTable = ({ columns, data, loading, actions }) => {
    const tableStyles = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '16px'
    };

    const thStyles = {
        padding: '12px',
        textAlign: 'left',
        borderBottom: '2px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        color: '#374151',
        fontWeight: '600',
        fontSize: '14px'
    };

    const tdStyles = {
        padding: '14px 12px',
        borderBottom: '1px solid #e5e7eb',
        fontSize: '14px',
        color: '#1f2937'
    };

    if (loading) {
        return <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>Loading data...</div>;
    }

    if (!data || data.length === 0) {
        return <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>No records found</div>;
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={tableStyles}>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} style={thStyles}>{col.header}</th>
                        ))}
                        {actions && <th style={thStyles}>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={row._id || rowIndex}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} style={tdStyles}>
                                    {col.render ? col.render(row) : row[col.accessor]}
                                </td>
                            ))}
                            {actions && (
                                <td style={tdStyles}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {actions(row)}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
