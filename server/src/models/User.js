/**
 * User Model
 * 
 * In-memory storage for users with CRUD operations
 */

// In-memory store for users
let users = [];
let nextId = 1;

class User {
  /**
   * Get all users
   * @returns {Array} List of all users
   */
  static getAll() {
    return [...users];
  }

  /**
   * Get a user by ID
   * @param {string|number} id - The user ID
   * @returns {Object|null} The user object or null if not found
   */
  static getById(id) {
    return users.find(user => user.id === parseInt(id)) || null;
  }

  /**
   * Create a new user
   * @param {Object} userData - The user data
   * @returns {Object} The created user
   */
  static create(userData) {
    const user = {
      id: nextId++,
      ...userData,
      borrowedBooks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.push(user);
    return user;
  }

  /**
   * Update a user
   * @param {string|number} id - The user ID
   * @param {Object} userData - The updated user data
   * @returns {Object|null} The updated user or null if not found
   */
  static update(id, userData) {
    const index = users.findIndex(user => user.id === parseInt(id));
    
    if (index === -1) {
      return null;
    }
    
    const updatedUser = {
      ...users[index],
      ...userData,
      id: parseInt(id), // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    users[index] = updatedUser;
    return updatedUser;
  }

  /**
   * Delete a user
   * @param {string|number} id - The user ID
   * @returns {boolean} True if deleted, false if not found
   */
  static delete(id) {
    const index = users.findIndex(user => user.id === parseInt(id));
    
    if (index === -1) {
      return false;
    }
    
    users.splice(index, 1);
    return true;
  }

  /**
   * Add a book to a user's borrowed books
   * @param {string|number} userId - The user ID
   * @param {string|number} bookId - The book ID
   * @param {Date} dueDate - The due date for the book
   * @returns {Object|null} The updated user or null if not found
   */
  static borrowBook(userId, bookId, dueDate) {
    const user = User.getById(userId);
    
    if (!user) {
      return null;
    }
    
    // Check if the user has already borrowed this book
    if (user.borrowedBooks.some(borrowed => borrowed.bookId === parseInt(bookId))) {
      return null;
    }
    
    const borrowedBook = {
      bookId: parseInt(bookId),
      borrowedOn: new Date().toISOString(),
      dueDate: dueDate.toISOString()
    };
    
    return User.update(userId, {
      borrowedBooks: [...user.borrowedBooks, borrowedBook]
    });
  }

  /**
   * Remove a book from a user's borrowed books
   * @param {string|number} userId - The user ID
   * @param {string|number} bookId - The book ID
   * @returns {Object|null} The updated user or null if not found or not borrowed
   */
  static returnBook(userId, bookId) {
    const user = User.getById(userId);
    
    if (!user) {
      return null;
    }
    
    // Check if the user has borrowed this book
    if (!user.borrowedBooks.some(borrowed => borrowed.bookId === parseInt(bookId))) {
      return null;
    }
    
    return User.update(userId, {
      borrowedBooks: user.borrowedBooks.filter(borrowed => borrowed.bookId !== parseInt(bookId))
    });
  }

  /**
   * Add some sample users to the store
   */
  static populateSampleData() {
    users = [
      {
        id: nextId++,
        name: "John Doe",
        email: "john.doe@example.com",
        membershipDate: new Date("2023-01-15").toISOString(),
        borrowedBooks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        membershipDate: new Date("2023-03-22").toISOString(),
        borrowedBooks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
}

// Add some sample data
User.populateSampleData();

module.exports = User; 