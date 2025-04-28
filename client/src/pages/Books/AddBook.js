import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import BookForm from '../../components/BookForm/BookForm';
import useBookStore from '../../store/bookStore';
import './AddBook.css';

/**
 * AddBook Page
 * 
 * Page for adding a new book
 */
const AddBook = () => {
  const navigate = useNavigate();
  const { addBook, isLoading, error, clearError } = useBookStore();
  
  // Handle form submission
  const handleSubmit = async (bookData) => {
    try {
      // Clear any previous errors
      clearError();
      
      // Add the book
      await addBook(bookData);
      
      // Navigate back to the books list
      navigate('/books');
    } catch (error) {
      console.error('Error adding book:', error);
      // Error will be set in the store
    }
  };
  
  // Handle form cancel
  const handleCancel = () => {
    navigate('/books');
  };
  
  return (
    <Layout>
      <div className="add-book">
        <div className="add-book-header">
          <h1>Add New Book</h1>
        </div>
        
        {error && (
          <div className="add-book-error">
            Error: {error}
          </div>
        )}
        
        <BookForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
};

export default AddBook; 