import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
// import FileUpload from '../../components/common/FileUpload'; 

const BulkUpload = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('courseId', courseId);

        setUploading(true);
        try {
            await api.post('/results/upload-csv', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('File uploaded successfully!');
            navigate(`/lecturer/upload-scores/${courseId}`);
        } catch (error) {
            alert('Upload failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    const downloadTemplate = () => {
        // Logic to download CSV template
        // matricNumber,caScore,examScore
        const csvContent = "data:text/csv;charset=utf-8,matricNumber,caScore,examScore\nCSC/2023/001,20,60";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "result_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Bulk Result Upload</h1>

            <Card>
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>1. Download Template</h3>
                    <p style={{ color: '#6b7280', marginBottom: '12px' }}>Use this CSV template to format your results.</p>
                    <Button variant="outline" onClick={downloadTemplate}>Download CSV Template</Button>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>2. Upload CSV</h3>
                    <input type="file" accept=".csv" onChange={handleFileChange} />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button onClick={handleUpload} disabled={!file || uploading}>
                        {uploading ? 'Uploading...' : 'Upload & Process'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
                </div>
            </Card>
        </div>
    );
};

export default BulkUpload;
