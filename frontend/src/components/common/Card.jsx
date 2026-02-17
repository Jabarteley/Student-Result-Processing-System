import React from 'react';

const Card = ({
    children,
    title,
    subtitle,
    headerAction,
    padding = 'normal',
    hover = false,
    onClick
}) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const cardStyles = {
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...(hover && isHovered ? {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
        } : {})
    };

    const headerStyles = {
        padding: padding === 'compact' ? '16px' : '20px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const titleContainerStyles = {
        flex: 1
    };

    const titleStyles = {
        fontSize: '18px',
        fontWeight: '700',
        color: '#111827',
        margin: 0
    };

    const subtitleStyles = {
        fontSize: '14px',
        color: '#6b7280',
        marginTop: '4px'
    };

    const bodyStyles = {
        padding: padding === 'none' ? 0 : padding === 'compact' ? '16px' : '24px'
    };

    return (
        <div
            style={cardStyles}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {(title || headerAction) && (
                <div style={headerStyles}>
                    <div style={titleContainerStyles}>
                        {title && <h3 style={titleStyles}>{title}</h3>}
                        {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div style={bodyStyles}>
                {children}
            </div>
        </div>
    );
};

export default Card;
