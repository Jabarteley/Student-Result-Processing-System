import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';

const DownloadResult = () => {
    const [session, setSession] = useState('');
    const [semester, setSemester] = useState('');
    const [generating, setGenerating] = useState(false);

    const handleDownload = () => {
        if (!session || !semester) return;
        setGenerating(true);
        // Simulate PDF generation delay
        setTimeout(() => {
            alert(`Generating PDF for ${session} ${semester} Semester... (Feature Pending Backend Implementation)`);
            setGenerating(false);
        }, 1500);
    };

    return (
        <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Download Result</h1>

            <Card>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <p style={{ color: '#6b7280', marginBottom: '8px' }}>
                        Select the academic session and semester you wish to download the result sheet for.
                    </p>

                    <Select
                        label="Session"
                        value={session}
                        onChange={(e) => setSession(e.target.value)}
                        options={[
                            { value: '2023/2024', label: '2023/2024' },
                            { value: '2022/2023', label: '2022/2023' }
                        ]}
                    />

                    <Select
                        label="Semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        options={[
                            { value: 'First', label: 'First Semester' },
                            { value: 'Second', label: 'Second Semester' }
                        ]}
                    />

                    <Button
                        onClick={handleDownload}
                        disabled={generating || !session || !semester}
                        style={{ marginTop: '12px' }}
                    >
                        {generating ? 'Generating PDF...' : 'Download PDF Result'}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default DownloadResult;
