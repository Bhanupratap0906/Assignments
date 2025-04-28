import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import BookCard from '../../components/BookCard/BookCard';
import Button from '../../components/Button/Button';
import useBookStore from '../../store/bookStore';
import './Dashboard.css';

/**
 * Dashboard Page
 * 
 * The main dashboard showing books and summary information
 */
const Dashboard = () => {
  const { books, loadBooks, isLoading, error } = useBookStore();
  
  // Load books when component mounts
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);
  
  // Calculate some stats for the dashboard
  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.copiesAvailable > 0).length;
  const unavailableBooks = totalBooks - availableBooks;
  
  // Get recent books (most recently added)
  const recentBooks = [...books]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);
  
  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <Link to="/books/add">
            <Button variant="primary">Add New Book</Button>
          </Link>
        </div>
        
        {isLoading && <div className="dashboard-loading">Loading...</div>}
        
        {error && (
          <div className="dashboard-error">
            Error: {error}
          </div>
        )}
        
        {!isLoading && !error && (
          <>
            <div className="dashboard-stats">
              <div className="dashboard-stat-card">
                <h3>Total Books</h3>
                <div className="dashboard-stat-value">{totalBooks}</div>
              </div>
              
              <div className="dashboard-stat-card">
                <h3>Available Books</h3>
                <div className="dashboard-stat-value">{availableBooks}</div>
              </div>
              
              <div className="dashboard-stat-card">
                <h3>Unavailable Books</h3>
                <div className="dashboard-stat-value">{unavailableBooks}</div>
              </div>
            </div>
            
            <section className="dashboard-section">
              <div className="dashboard-section-header">
                <h2>Recently Added Books</h2>
                <Link to="/books" className="dashboard-view-all">
                  View All
                </Link>
              </div>
              
              {recentBooks.length > 0 ? (
                <div className="dashboard-book-grid">
                  {recentBooks.map(book => (
                    <BookCard 
                      key={book.id} 
                      book={book}
                      onEdit={() => {}} // Not used in dashboard
                      onDelete={() => {}} // Not used in dashboard
                      onBorrow={() => {}} // Not used in dashboard
                      onReturn={() => {}} // Not used in dashboard
                    />
                  ))}
                </div>
              ) : (
                <div className="dashboard-empty">
                  No books available. Add some books to get started!
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard; 