import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import BookCard from '../../components/BookCard/BookCard';
import Button from '../../components/Button/Button';
import useBookStore from '../../store/bookStore';
import './BookList.css';

/**
 * BookList Page
 * 
 * Displays a list of all books with filtering and sorting
 */
const BookList = () => {
  const navigate = useNavigate();
  const { books, loadBooks, deleteBook, isLoading, error } = useBookStore();
  
  // State for filters and sorting
  const [filters, setFilters] = useState({
    searchTerm: '',
    genre: '',
    availability: 'all' // all, available, unavailable
  });
  
  const [sortBy, setSortBy] = useState({
    field: 'title',
    direction: 'asc'
  });
  
  // Load books when component mounts
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle sort changes
  const handleSortChange = (e) => {
    const value = e.target.value;
    const [field, direction] = value.split(':');
    
    setSortBy({
      field,
      direction
    });
  };
  
  // Handle book deletion
  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(bookId);
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };
  
  // Handle book edit
  const handleEditBook = (book) => {
    navigate(`/books/edit/${book.id}`);
  };
  
  // Filter and sort books
  const filteredAndSortedBooks = books
    // Filter by search term
    .filter(book => {
      if (!filters.searchTerm) return true;
      
      const searchTermLower = filters.searchTerm.toLowerCase();
      return book.title.toLowerCase().includes(searchTermLower) ||
        book.author.toLowerCase().includes(searchTermLower) ||
        book.isbn.includes(filters.searchTerm);
    })
    // Filter by genre
    .filter(book => {
      if (!filters.genre) return true;
      return book.genre === filters.genre;
    })
    // Filter by availability
    .filter(book => {
      if (filters.availability === 'all') return true;
      if (filters.availability === 'available') return book.copiesAvailable > 0;
      if (filters.availability === 'unavailable') return book.copiesAvailable === 0;
      return true;
    })
    // Sort
    .sort((a, b) => {
      let aValue = a[sortBy.field];
      let bValue = b[sortBy.field];
      
      // Special handling for dates
      if (sortBy.field === 'publishedDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      // Compare values
      if (aValue < bValue) {
        return sortBy.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortBy.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  
  // Get unique genres for filter dropdown
  const genres = [...new Set(books.map(book => book.genre))].filter(Boolean);
  
  return (
    <Layout>
      <div className="book-list">
        <div className="book-list-header">
          <h1>Books</h1>
          <Link to="/books/add">
            <Button variant="primary">Add New Book</Button>
          </Link>
        </div>
        
        {error && (
          <div className="book-list-error">
            Error: {error}
          </div>
        )}
        
        <div className="book-list-filters">
          <div className="book-list-search">
            <input
              type="text"
              name="searchTerm"
              placeholder="Search by title, author, or ISBN..."
              value={filters.searchTerm}
              onChange={handleFilterChange}
              className="book-list-search-input"
            />
          </div>
          
          <div className="book-list-filter-controls">
            <select
              name="genre"
              value={filters.genre}
              onChange={handleFilterChange}
              className="book-list-filter-select"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            
            <select
              name="availability"
              value={filters.availability}
              onChange={handleFilterChange}
              className="book-list-filter-select"
            >
              <option value="all">All Books</option>
              <option value="available">Available Books</option>
              <option value="unavailable">Unavailable Books</option>
            </select>
            
            <select
              value={`${sortBy.field}:${sortBy.direction}`}
              onChange={handleSortChange}
              className="book-list-filter-select"
            >
              <option value="title:asc">Title (A-Z)</option>
              <option value="title:desc">Title (Z-A)</option>
              <option value="author:asc">Author (A-Z)</option>
              <option value="author:desc">Author (Z-A)</option>
              <option value="publishedDate:desc">Newest First</option>
              <option value="publishedDate:asc">Oldest First</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="book-list-loading">Loading books...</div>
        ) : filteredAndSortedBooks.length > 0 ? (
          <div className="book-list-grid">
            {filteredAndSortedBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
                isAdmin={true}
              />
            ))}
          </div>
        ) : (
          <div className="book-list-empty">
            {filters.searchTerm || filters.genre || filters.availability !== 'all' ? (
              <p>No books found matching your filters. Try adjusting your search criteria.</p>
            ) : (
              <p>No books available. Click "Add New Book" to add a book.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookList; 