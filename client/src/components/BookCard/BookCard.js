import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card/Card';
import Button from '../Button/Button';
import './BookCard.css';

/**
 * BookCard Component
 * 
 * Displays a book in a card format with actions
 * 
 * @param {Object} book - The book data to display
 * @param {function} onEdit - Edit handler function
 * @param {function} onDelete - Delete handler function
 * @param {function} onBorrow - Borrow handler function
 * @param {function} onReturn - Return handler function
 * @param {boolean} isAdmin - Whether the user is an admin
 * @param {boolean} isBorrowed - Whether the book is borrowed by the current user
 */
const BookCard = ({ 
  book, 
  onEdit, 
  onDelete, 
  onBorrow, 
  onReturn,
  isAdmin = false,
  isBorrowed = false
}) => {
  const navigate = useNavigate();
  
  // Handle card click to navigate to book details
  const handleCardClick = () => {
    navigate(`/books/${book.id}`);
  };

  // Format published date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="book-card-container">
      <Card elevation={true} onClick={handleCardClick}>
        <div className="book-card-content">
          <h3 className="book-card-title">{book.title}</h3>
          <p className="book-card-author">by {book.author}</p>
          
          <div className="book-card-details">
            <div className="book-card-detail">
              <span className="book-card-label">Published:</span>
              <span>{formatDate(book.publishedDate)}</span>
            </div>
            
            <div className="book-card-detail">
              <span className="book-card-label">Genre:</span>
              <span>{book.genre || 'Unspecified'}</span>
            </div>
            
            <div className="book-card-detail">
              <span className="book-card-label">ISBN:</span>
              <span>{book.isbn}</span>
            </div>
            
            <div className="book-card-detail">
              <span className="book-card-label">Available:</span>
              <span>{book.copiesAvailable} / {book.totalCopies}</span>
            </div>
          </div>
          
          {book.description && (
            <p className="book-card-description">
              {book.description.length > 100
                ? `${book.description.slice(0, 100)}...`
                : book.description}
            </p>
          )}
        </div>
      </Card>
      
      <div className="book-card-actions" onClick={(e) => e.stopPropagation()}>
        {isAdmin && (
          <>
            <Button variant="outlined" size="small" onClick={() => onEdit(book)}>
              Edit
            </Button>
            <Button variant="text" size="small" onClick={() => onDelete(book.id)}>
              Delete
            </Button>
          </>
        )}
        
        {!isAdmin && book.copiesAvailable > 0 && !isBorrowed && onBorrow && (
          <Button variant="primary" size="small" onClick={() => onBorrow(book.id)}>
            Borrow
          </Button>
        )}
        
        {!isAdmin && isBorrowed && onReturn && (
          <Button variant="secondary" size="small" onClick={() => onReturn(book.id)}>
            Return
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookCard; 