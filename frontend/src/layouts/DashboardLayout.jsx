import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';

const Layout = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check auth
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
            setLoading(false);
            return;
        }

        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            console.error('Invalid user data');
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const layoutStyles = {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6'
    };

    const mainStyles = {
        flex: 1,
        marginLeft: '260px', // Width of sidebar
        padding: '32px',
        overflowY: 'auto'
    };

    return (
        <div style={layoutStyles}>
            <Sidebar role={user.role} user={user} />
            <main style={mainStyles}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
