/**
 * Book Controller
 * 
 * Handles book-related operations
 */

const Book = require('../models/Book');

/**
 * Get all books
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getAllBooks(req, res) {
  try {
    const books = Book.getAll();
    res.status(200).json({
      success: true,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message
    });
  }
}

/**
 * Get a book by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getBookById(req, res) {
  try {
    const { id } = req.params;
    const book = Book.getById(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching book',
      error: error.message
    });
  }
}

/**
 * Create a new book
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function createBook(req, res) {
  try {
    // The validator middleware has already validated and transformed the data
    const bookData = req.body;
    
    // Create the book
    const book = Book.create(bookData);
    
    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating book',
      error: error.message
    });
  }
}

/**
 * Update a book
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function updateBook(req, res) {
  try {
    const { id } = req.params;
    
    // The validator middleware has already validated and transformed the data
    const bookData = req.body;
    
    // Update the book
    const book = Book.update(id, bookData);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating book',
      error: error.message
    });
  }
}

/**
 * Delete a book
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function deleteBook(req, res) {
  try {
    const { id } = req.params;
    
    // Delete the book
    const deleted = Book.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Book with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Book with ID ${id} deleted successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting book',
      error: error.message
    });
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
}; 