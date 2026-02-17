import React from 'react';
import Button from './Button';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'medium',
    showCloseButton = true
}) => {
    if (!isOpen) return null;

    const overlayStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
    };

    const modalSizes = {
        small: '400px',
        medium: '600px',
        large: '800px',
        xlarge: '1000px'
    };

    const modalStyles = {
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        width: '90%',
        maxWidth: modalSizes[size],
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s ease-out'
    };

    const headerStyles = {
        padding: '24px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const titleStyles = {
        fontSize: '20px',
        fontWeight: '700',
        color: '#111827',
        margin: 0
    };

    const closeButtonStyles = {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#6b7280',
        padding: '4px',
        lineHeight: 1,
        transition: 'color 0.2s'
    };

    const bodyStyles = {
        padding: '24px',
        overflowY: 'auto',
        flex: 1
    };

    const footerStyles = {
        padding: '16px 24px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px'
    };

    // Close on escape key
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <>

            <div style={overlayStyles} onClick={onClose}>
                <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
                    <div style={headerStyles}>
                        <h2 style={titleStyles}>{title}</h2>
                        {showCloseButton && (
                            <button
                                style={closeButtonStyles}
                                onClick={onClose}
                                onMouseEnter={(e) => e.target.style.color = '#111827'}
                                onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <div style={bodyStyles}>
                        {children}
                    </div>
                    {footer && (
                        <div style={footerStyles}>
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Modal;
