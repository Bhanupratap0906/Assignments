/**
 * User Controller
 * 
 * Handles user-related operations
 */

const User = require('../models/User');
const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getAllUsers(req, res) {
  try {
    const users = User.getAll();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
}

/**
 * Get a user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = User.getById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
}

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function createUser(req, res) {
  try {
    // The validator middleware has already validated and transformed the data
    const userData = req.body;
    
    // Create the user
    const user = User.create(userData);
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
}

/**
 * Update a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function updateUser(req, res) {
  try {
    const { id } = req.params;
    
    // The validator middleware has already validated and transformed the data
    const userData = req.body;
    
    // Update the user
    const user = User.update(id, userData);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
}

/**
 * Delete a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function deleteUser(req, res) {
  try {
    const { id } = req.params;
    
    // Delete the user
    const deleted = User.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      message: `User with ID ${id} deleted successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
}

/**
 * Borrow a book for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function borrowBook(req, res) {
  try {
    const { id: userId } = req.params;
    const { bookId } = req.body;
    
    // Set due date to 14 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    
    // Check if the user exists
    const user = User.getById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found`
      });
    }
    
    // Check if the book exists
    const book = Book.getById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book with ID ${bookId} not found`
      });
    }
    
    // Check if the book is available
    if (book.copiesAvailable <= 0) {
      return res.status(400).json({
        success: false,
        message: `Book with ID ${bookId} is not available for borrowing`
      });
    }
    
    // Update the book's available copies
    const updatedBook = Book.update(bookId, {
      copiesAvailable: book.copiesAvailable - 1
    });
    
    if (!updatedBook) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update book availability'
      });
    }
    
    // Add the book to the user's borrowed books
    const updatedUser = User.borrowBook(userId, bookId, dueDate);
    
    if (!updatedUser) {
      // Revert the book's available copies
      Book.update(bookId, {
        copiesAvailable: book.copiesAvailable
      });
      
      return res.status(500).json({
        success: false,
        message: 'Failed to borrow book for user'
      });
    }
    
    // Create a borrow record
    const borrowRecord = BorrowRecord.borrowBook(userId, bookId, dueDate);
    
    res.status(200).json({
      success: true,
      data: {
        user: updatedUser,
        book: updatedBook,
        borrowRecord
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error borrowing book',
      error: error.message
    });
  }
}

/**
 * Return a book for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function returnBook(req, res) {
  try {
    const { id: userId } = req.params;
    const { bookId } = req.body;
    
    // Check if the user exists
    const user = User.getById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found`
      });
    }
    
    // Check if the book exists
    const book = Book.getById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book with ID ${bookId} not found`
      });
    }
    
    // Update the book's available copies
    const updatedBook = Book.update(bookId, {
      copiesAvailable: book.copiesAvailable + 1
    });
    
    if (!updatedBook) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update book availability'
      });
    }
    
    // Remove the book from the user's borrowed books
    const updatedUser = User.returnBook(userId, bookId);
    
    if (!updatedUser) {
      // Revert the book's available copies
      Book.update(bookId, {
        copiesAvailable: book.copiesAvailable
      });
      
      return res.status(400).json({
        success: false,
        message: `User with ID ${userId} has not borrowed the book with ID ${bookId}`
      });
    }
    
    // Update the borrow record
    const borrowRecord = BorrowRecord.returnBook(userId, bookId);
    
    if (!borrowRecord) {
      // This shouldn't happen if the user model says they borrowed the book
      console.error('Inconsistent state: User has borrowed book but no corresponding borrow record found');
    }
    
    res.status(200).json({
      success: true,
      data: {
        user: updatedUser,
        book: updatedBook,
        borrowRecord
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error returning book',
      error: error.message
    });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  borrowBook,
  returnBook
}; 