import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

/**
 * Layout Component
 * 
 * Layout wrapper that includes header, main content, and footer
 * 
 * @param {ReactNode} children - The main content to display
 */
const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 