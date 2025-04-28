import { create } from 'zustand';
import { bookApi } from '../utils/api';

const useBookStore = create((set, get) => ({
  books: [],
  selectedBook: null,
  isLoading: false,
  error: null,
  
  loadBooks: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await bookApi.getAll();
      const books = Array.isArray(response) ? response : 
                   (response.data ? response.data : []);
      set({ books, isLoading: false });
    } catch (error) {
      set({ 
        error: error.message || 'Failed to load books', 
        isLoading: false 
      });
    }
  },
  
  getBook: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await bookApi.getById(id);
      const book = response.data || response;
      set({ selectedBook: book, isLoading: false });
      return book;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to load book', 
        isLoading: false 
      });
      return null;
    }
  },
  
  addBook: async (bookData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await bookApi.create(bookData);
      const book = response.data || response;
      set(state => ({ 
        books: [...state.books, book], 
        isLoading: false 
      }));
      return book;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to add book', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateBook: async (id, bookData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await bookApi.update(id, bookData);
      const book = response.data || response;
      set(state => ({
        books: state.books.map(item => 
          item.id === parseInt(id) ? book : item
        ),
        selectedBook: book,
        isLoading: false
      }));
      return book;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to update book', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deleteBook: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await bookApi.delete(id);
      set(state => ({
        books: state.books.filter(book => book.id !== parseInt(id)),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to delete book', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  clearSelectedBook: () => {
    set({ selectedBook: null });
  },
  
  clearError: () => {
    set({ error: null });
  }
}));

export default useBookStore;
