import React from 'react';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    type = 'button',
    fullWidth = false,
    icon = null
}) => {
    const baseStyles = {
        padding: size === 'small' ? '8px 16px' : size === 'large' ? '14px 28px' : '10px 20px',
        fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
        fontWeight: '600',
        border: 'none',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: fullWidth ? '100%' : 'auto',
        fontFamily: 'inherit'
    };

    const variantStyles = {
        primary: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
        },
        secondary: {
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db'
        },
        success: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
        },
        danger: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
        },
        warning: {
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
        },
        outline: {
            background: 'transparent',
            color: '#667eea',
            border: '2px solid #667eea'
        }
    };

    const hoverStyles = !disabled ? {
        transform: 'translateY(-2px)',
        boxShadow: variant === 'primary' ? '0 6px 20px rgba(102, 126, 234, 0.6)' :
            variant === 'success' ? '0 6px 20px rgba(16, 185, 129, 0.6)' :
                variant === 'danger' ? '0 6px 20px rgba(239, 68, 68, 0.6)' :
                    variant === 'warning' ? '0 6px 20px rgba(245, 158, 11, 0.6)' :
                        '0 6px 20px rgba(0, 0, 0, 0.1)'
    } : {};

    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                ...baseStyles,
                ...variantStyles[variant],
                ...(isHovered ? hoverStyles : {})
            }}
        >
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
};

export default Button;
