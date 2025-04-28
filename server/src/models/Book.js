/**
 * Book Model
 * 
 * In-memory storage for books with CRUD operations
 */

// In-memory store for books
let books = [];
let nextId = 1;

class Book {
  /**
   * Get all books
   * @returns {Array} List of all books
   */
  static getAll() {
    return [...books];
  }

  /**
   * Get a book by ID
   * @param {string|number} id - The book ID
   * @returns {Object|null} The book object or null if not found
   */
  static getById(id) {
    return books.find(book => book.id === parseInt(id)) || null;
  }

  /**
   * Create a new book
   * @param {Object} bookData - The book data
   * @returns {Object} The created book
   */
  static create(bookData) {
    const book = {
      id: nextId++,
      ...bookData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    books.push(book);
    return book;
  }

  /**
   * Update a book
   * @param {string|number} id - The book ID
   * @param {Object} bookData - The updated book data
   * @returns {Object|null} The updated book or null if not found
   */
  static update(id, bookData) {
    const index = books.findIndex(book => book.id === parseInt(id));
    
    if (index === -1) {
      return null;
    }
    
    const updatedBook = {
      ...books[index],
      ...bookData,
      id: parseInt(id), // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    books[index] = updatedBook;
    return updatedBook;
  }

  /**
   * Delete a book
   * @param {string|number} id - The book ID
   * @returns {boolean} True if deleted, false if not found
   */
  static delete(id) {
    const index = books.findIndex(book => book.id === parseInt(id));
    
    if (index === -1) {
      return false;
    }
    
    books.splice(index, 1);
    return true;
  }

  /**
   * Add some sample books to the store
   */
  static populateSampleData() {
    books = [
      {
        id: nextId++,
        title: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        isbn: "9780596517748",
        publishedDate: new Date("2008-05-01").toISOString(),
        genre: "Programming",
        description: "Reveals the good parts of JavaScript that you should use and the bad parts that you should avoid.",
        copiesAvailable: 10,
        totalCopies: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: "Clean Code",
        author: "Robert C. Martin",
        isbn: "9780132350884",
        publishedDate: new Date("2008-08-01").toISOString(),
        genre: "Programming",
        description: "A handbook of agile software craftsmanship.",
        copiesAvailable: 8,
        totalCopies: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        isbn: "9780262033848",
        publishedDate: new Date("2009-07-31").toISOString(),
        genre: "Academic",
        description: "A comprehensive introduction to modern algorithms.",
        copiesAvailable: 6,
        totalCopies: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
}

// Add some sample data
Book.populateSampleData();

module.exports = Book; 