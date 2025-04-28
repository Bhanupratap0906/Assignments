import React from 'react';
import './Card.css';

/**
 * Card Component
 * 
 * A reusable card component for displaying content in a card layout
 * 
 * @param {ReactNode} children - Card content
 * @param {string} title - Card title
 * @param {boolean} elevation - Apply elevation (shadow)
 * @param {function} onClick - Click handler function
 */
const Card = ({ 
  children, 
  title, 
  elevation = true, 
  onClick,
  ...restProps 
}) => {
  return (
    <div 
      className={`card ${elevation ? 'card-elevation' : ''}`} 
      onClick={onClick}
      {...restProps}
    >
      {title && <div className="card-title">{title}</div>}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card; 