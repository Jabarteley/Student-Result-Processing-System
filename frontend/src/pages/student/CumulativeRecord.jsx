import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const CumulativeRecord = () => {
    // Placeholder for full transcript view
    return (
        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Unofficial Transcript</h1>
                <Button>Print Record</Button>
            </div>

            <Card>
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    <p style={{ fontSize: '18px', fontWeight: '600' }}>Student Academic Record</p>
                    <p style={{ margin: '16px 0' }}>Creating a full transcript view requires mapping all historical results by session.</p>
                    <p>This page will display:</p>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '16px', lineHeight: '1.6' }}>
                        <li>100 Level (First & Second Semester)</li>
                        <li>200 Level (First & Second Semester)</li>
                        <li>300 Level (First & Second Semester)</li>
                        <li>Cumulative GPAs for each session</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
};

export default CumulativeRecord;
