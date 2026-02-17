import React from 'react';

const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    required = false,
    disabled = false,
    error = '',
    placeholder = 'Select an option',
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

    const selectStyles = {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: error ? '#ef4444' : '#e5e7eb',
        borderRadius: '8px',
        outline: 'none',
        transition: 'all 0.3s ease',
        backgroundColor: disabled ? '#f9fafb' : '#fff',
        color: disabled ? '#9ca3af' : '#111827',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit'
    };

    const errorStyles = {
        marginTop: '6px',
        fontSize: '13px',
        color: '#ef4444'
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
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{
                    ...selectStyles,
                    ...focusedStyles
                }}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option
                        key={index}
                        value={typeof option === 'object' ? option.value : option}
                    >
                        {typeof option === 'object' ? option.label : option}
                    </option>
                ))}
            </select>
            {error && <div style={errorStyles}>{error}</div>}
        </div>
    );
};

export default Select;
