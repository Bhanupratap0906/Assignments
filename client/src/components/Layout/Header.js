import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

/**
 * Header Component
 * 
 * The application header with navigation
 */
const Header = () => {
  const location = useLocation();
  
  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="header-logo">
            📚 Book Management
          </Link>
          
          <nav className="header-nav">
            <ul className="header-nav-list">
              <li className="header-nav-item">
                <Link 
                  to="/" 
                  className={`header-nav-link ${isActive('/') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
              </li>
              <li className="header-nav-item">
                <Link 
                  to="/books" 
                  className={`header-nav-link ${isActive('/books') ? 'active' : ''}`}
                >
                  Books
                </Link>
              </li>
              <li className="header-nav-item">
                <Link 
                  to="/users" 
                  className={`header-nav-link ${isActive('/users') ? 'active' : ''}`}
                >
                  Users
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 