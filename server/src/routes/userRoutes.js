/**
 * User Routes
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateRequest = require('../middlewares/validateRequest');
const { userSchema, borrowSchema, returnSchema } = require('../utils/validator');

// GET /api/users - Get all users
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Get a single user by ID
router.get('/:id', userController.getUserById);

// POST /api/users - Create a new user
router.post('/', validateRequest(userSchema), userController.createUser);

// PUT /api/users/:id - Update a user
router.put('/:id', validateRequest(userSchema), userController.updateUser);

// DELETE /api/users/:id - Delete a user
router.delete('/:id', userController.deleteUser);

// POST /api/users/:id/borrow - Borrow a book
router.post('/:id/borrow', validateRequest(borrowSchema), userController.borrowBook);

// POST /api/users/:id/return - Return a book
router.post('/:id/return', validateRequest(returnSchema), userController.returnBook);

module.exports = router; 