import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import BookForm from '../../components/BookForm/BookForm';
import useBookStore from '../../store/bookStore';
import './EditBook.css';

/**
 * EditBook Page
 * 
 * Page for editing an existing book
 */
const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    selectedBook, 
    getBook, 
    updateBook, 
    clearSelectedBook, 
    isLoading, 
    error, 
    clearError 
  } = useBookStore();
  
  // Load the book when the component mounts
  useEffect(() => {
    const loadBook = async () => {
      try {
        await getBook(id);
      } catch (error) {
        console.error('Error loading book:', error);
        navigate('/books');
      }
    };
    
    loadBook();
    
    // Clear the selected book when the component unmounts
    return () => {
      clearSelectedBook();
    };
  }, [id, getBook, navigate, clearSelectedBook]);
  
  // Handle form submission
  const handleSubmit = async (bookData) => {
    try {
      // Clear any previous errors
      clearError();
      
      // Update the book
      await updateBook(id, bookData);
      
      // Navigate back to the books list
      navigate('/books');
    } catch (error) {
      console.error('Error updating book:', error);
      // Error will be set in the store
    }
  };
  
  // Handle form cancel
  const handleCancel = () => {
    navigate('/books');
  };
  
  return (
    <Layout>
      <div className="edit-book">
        <div className="edit-book-header">
          <h1>Edit Book</h1>
        </div>
        
        {error && (
          <div className="edit-book-error">
            Error: {error}
          </div>
        )}
        
        {isLoading && !selectedBook ? (
          <div className="edit-book-loading">Loading book...</div>
        ) : selectedBook ? (
          <BookForm
            initialData={selectedBook}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        ) : (
          <div className="edit-book-not-found">
            Book not found. The book may have been deleted.
            <button 
              className="edit-book-back-button"
              onClick={() => navigate('/books')}
            >
              Back to Books
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EditBook; 