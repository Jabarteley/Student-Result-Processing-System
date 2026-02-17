import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';

const Reports = () => {
    const [reportType, setReportType] = useState('summary');

    const containerStyles = { padding: '24px', maxWidth: '1200px', margin: '0 auto' };
    const headerStyles = { marginBottom: '32px' };
    const titleStyles = { fontSize: '28px', fontWeight: '700', color: '#111827' };

    const placeholderChartStyles = {
        height: '300px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b7280',
        marginBottom: '24px'
    };

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <h1 style={titleStyles}>Reports & Analytics</h1>
                <p style={{ color: '#6b7280' }}>Academic performance and system insights</p>
            </div>

            <Card>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <Select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        options={[
                            { value: 'summary', label: 'General Summary' },
                            { value: 'performance', label: 'Department Performance' },
                            { value: 'demographics', label: 'Student Demographics' }
                        ]}
                        style={{ width: '250px' }}
                    />
                    <Button>Generate Report</Button>
                    <Button variant="secondary">Export PDF</Button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                    <Card title="Grade Distribution">
                        <div style={placeholderChartStyles}>
                            [Bar Chart: A, B, C, D, E, F Distribution]
                        </div>
                    </Card>

                    <Card title="Pass/Fail Rates">
                        <div style={placeholderChartStyles}>
                            [Pie Chart: Pass vs Fail]
                        </div>
                    </Card>

                    <Card title="Department GPA Comparison">
                        <div style={placeholderChartStyles}>
                            [Bar Chart: Average GPA per Dept]
                        </div>
                    </Card>
                </div>
            </Card>
        </div>
    );
};

export default Reports;
