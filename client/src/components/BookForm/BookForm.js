import React, { useState, useEffect } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { validate, bookSchema } from '../../utils/validator';
import './BookForm.css';

/**
 * BookForm Component
 * 
 * Form for adding or editing a book with validation
 * 
 * @param {Object} initialData - Initial book data (for editing)
 * @param {function} onSubmit - Submit handler function
 * @param {function} onCancel - Cancel handler function
 * @param {boolean} isLoading - Loading state
 */
const BookForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  isLoading = false
}) => {
  // Initialize form state with empty values or initial data
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    author: initialData.author || '',
    isbn: initialData.isbn || '',
    publishedDate: initialData.publishedDate 
      ? new Date(initialData.publishedDate).toISOString().split('T')[0] 
      : '',
    genre: initialData.genre || '',
    description: initialData.description || '',
    copiesAvailable: initialData.copiesAvailable || 1,
    totalCopies: initialData.totalCopies || 1
  });
  
  // State for validation errors
  const [errors, setErrors] = useState({});
  
  // When initialData changes, update form data
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        isbn: initialData.isbn || '',
        publishedDate: initialData.publishedDate 
          ? new Date(initialData.publishedDate).toISOString().split('T')[0] 
          : '',
        genre: initialData.genre || '',
        description: initialData.description || '',
        copiesAvailable: initialData.copiesAvailable || 1,
        totalCopies: initialData.totalCopies || 1
      });
      setErrors({});
    }
  }, [initialData]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    // Convert to the proper types for validation
    const dataToValidate = {
      ...formData,
      publishedDate: formData.publishedDate ? new Date(formData.publishedDate) : null,
      copiesAvailable: Number(formData.copiesAvailable),
      totalCopies: Number(formData.totalCopies)
    };
    
    const result = validate(dataToValidate, bookSchema);
    
    if (!result.valid) {
      // Convert validation errors to field-specific error messages
      const fieldErrors = {};
      result.errors.forEach(error => {
        fieldErrors[error.field] = error.message;
      });
      
      setErrors(fieldErrors);
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert string values to appropriate types
      const processedData = {
        ...formData,
        publishedDate: new Date(formData.publishedDate).toISOString(),
        copiesAvailable: Number(formData.copiesAvailable),
        totalCopies: Number(formData.totalCopies)
      };
      
      onSubmit(processedData);
    }
  };
  
  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="book-form-grid">
        <Input
          label="Title"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          error={errors.title}
          fullWidth
        />
        
        <Input
          label="Author"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          error={errors.author}
          fullWidth
        />
        
        <Input
          label="ISBN"
          id="isbn"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          required
          error={errors.isbn}
          fullWidth
        />
        
        <Input
          label="Published Date"
          id="publishedDate"
          name="publishedDate"
          type="date"
          value={formData.publishedDate}
          onChange={handleChange}
          required
          error={errors.publishedDate}
          fullWidth
        />
        
        <Input
          label="Genre"
          id="genre"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          error={errors.genre}
          fullWidth
        />
        
        <div className="book-form-copies">
          <Input
            label="Copies Available"
            id="copiesAvailable"
            name="copiesAvailable"
            type="number"
            min="0"
            value={formData.copiesAvailable}
            onChange={handleChange}
            error={errors.copiesAvailable}
          />
          
          <Input
            label="Total Copies"
            id="totalCopies"
            name="totalCopies"
            type="number"
            min="1"
            value={formData.totalCopies}
            onChange={handleChange}
            error={errors.totalCopies}
          />
        </div>
      </div>
      
      <Input
        label="Description"
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        fullWidth
      />
      
      <div className="book-form-actions">
        <Button 
          variant="outlined" 
          onClick={onCancel}
          disabled={isLoading}
          type="button"
        >
          Cancel
        </Button>
        
        <Button 
          variant="primary" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData.id ? 'Update Book' : 'Add Book'}
        </Button>
      </div>
    </form>
  );
};

export default BookForm; 