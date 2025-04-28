import React from 'react';
import './Input.css';

/**
 * Input Component
 * 
 * A reusable input component
 * 
 * @param {string} label - Input label
 * @param {string} type - Input type (text, password, email, number, etc.)
 * @param {string} id - Input id
 * @param {string} name - Input name
 * @param {string} placeholder - Input placeholder
 * @param {string} value - Input value
 * @param {function} onChange - Change handler function
 * @param {boolean} required - Is the input required
 * @param {string} error - Error message
 * @param {boolean} fullWidth - Make the input full width
 */
const Input = ({
  label,
  type = 'text',
  id,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  error = '',
  fullWidth = false,
  ...restProps
}) => {
  return (
    <div className={`input-wrapper ${fullWidth ? 'input-full-width' : ''}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        className={`input ${error ? 'input-error' : ''}`}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error && id ? `${id}-error` : undefined}
        {...restProps}
      />
      {error && (
        <div className="input-error-message" id={`${id}-error`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Input; 