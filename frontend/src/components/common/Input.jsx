import React from 'react';

const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder = '',
    required = false,
    disabled = false,
    error = '',
    helperText = '',
    icon = null,
    ...props
}) => {
    const containerStyles = {
        marginBottom: '20px',
        width: '100%'
    };

    const labelStyles = {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151'
    };

    const inputWrapperStyles = {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    };

    const inputStyles = {
        width: '100%',
        padding: icon ? '12px 12px 12px 40px' : '12px',
        fontSize: '16px',
        border: error ? '2px solid #ef4444' : '2px solid #e5e7eb',
        borderRadius: '8px',
        outline: 'none',
        transition: 'all 0.3s ease',
        backgroundColor: disabled ? '#f9fafb' : '#fff',
        color: disabled ? '#9ca3af' : '#111827',
        fontFamily: 'inherit'
    };

    const iconStyles = {
        position: 'absolute',
        left: '12px',
        color: '#9ca3af',
        fontSize: '18px'
    };

    const errorStyles = {
        marginTop: '6px',
        fontSize: '13px',
        color: '#ef4444'
    };

    const helperStyles = {
        marginTop: '6px',
        fontSize: '13px',
        color: '#6b7280'
    };

    const [isFocused, setIsFocused] = React.useState(false);

    const focusedStyles = isFocused && !error ? {
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    } : {};

    return (
        <div style={containerStyles}>
            {label && (
                <label htmlFor={name} style={labelStyles}>
                    {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
            )}
            <div style={inputWrapperStyles}>
                {icon && <span style={iconStyles}>{icon}</span>}
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={{
                        ...inputStyles,
                        ...focusedStyles
                    }}
                    {...props}
                />
            </div>
            {error && <div style={errorStyles}>{error}</div>}
            {helperText && !error && <div style={helperStyles}>{helperText}</div>}
        </div>
    );
};

export default Input;
