/**
 * Book Routes
 */

const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const validateRequest = require('../middlewares/validateRequest');
const { bookSchema } = require('../utils/validator');

// GET /api/books - Get all books
router.get('/', bookController.getAllBooks);

// GET /api/books/:id - Get a single book by ID
router.get('/:id', bookController.getBookById);

// POST /api/books - Create a new book
router.post('/', validateRequest(bookSchema), bookController.createBook);

// PUT /api/books/:id - Update a book
router.put('/:id', validateRequest(bookSchema), bookController.updateBook);

// DELETE /api/books/:id - Delete a book
router.delete('/:id', bookController.deleteBook);

module.exports = router; 