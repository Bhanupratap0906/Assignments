import React from 'react';
import './Button.css';

/**
 * Button Component
 * 
 * A reusable button component with different variants
 * 
 * @param {string} variant - primary, secondary, outlined, text
 * @param {string} size - small, medium, large
 * @param {function} onClick - Click handler function
 * @param {boolean} disabled - Disable the button
 * @param {boolean} fullWidth - Make the button full width
 * @param {string} type - Button type (button, submit, reset)
 * @param {ReactNode} children - Button content
 */
const Button = ({ 
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  fullWidth = false,
  type = 'button',
  children,
  ...restProps
}) => {
  const buttonClasses = `
    button 
    button-${variant} 
    button-${size}
    ${fullWidth ? 'button-full-width' : ''}
  `;

  return (
    <button
      className={buttonClasses}
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button; 