/**
 * BorrowRecord Model
 * 
 * In-memory storage for borrowing and returning actions
 */

// In-memory store for borrow records
let borrowRecords = [];
let nextId = 1;

class BorrowRecord {
  /**
   * Get all borrow records
   * @returns {Array} List of all borrow records
   */
  static getAll() {
    return [...borrowRecords];
  }

  /**
   * Get a borrow record by ID
   * @param {string|number} id - The record ID
   * @returns {Object|null} The record object or null if not found
   */
  static getById(id) {
    return borrowRecords.find(record => record.id === parseInt(id)) || null;
  }

  /**
   * Get borrow records by user ID
   * @param {string|number} userId - The user ID
   * @returns {Array} List of borrow records for the user
   */
  static getByUserId(userId) {
    return borrowRecords.filter(record => record.userId === parseInt(userId));
  }

  /**
   * Get borrow records by book ID
   * @param {string|number} bookId - The book ID
   * @returns {Array} List of borrow records for the book
   */
  static getByBookId(bookId) {
    return borrowRecords.filter(record => record.bookId === parseInt(bookId));
  }

  /**
   * Create a new borrow record
   * @param {Object} recordData - The borrow record data
   * @returns {Object} The created borrow record
   */
  static create(recordData) {
    const record = {
      id: nextId++,
      ...recordData,
      createdAt: new Date().toISOString()
    };
    
    borrowRecords.push(record);
    return record;
  }

  /**
   * Record a book borrowing action
   * @param {string|number} userId - The user ID
   * @param {string|number} bookId - The book ID
   * @param {Date} dueDate - When the book is due to be returned
   * @returns {Object} The created borrow record
   */
  static borrowBook(userId, bookId, dueDate) {
    return BorrowRecord.create({
      userId: parseInt(userId),
      bookId: parseInt(bookId),
      borrowDate: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
      returnDate: null,
      status: 'borrowed'
    });
  }

  /**
   * Record a book return action
   * @param {string|number} userId - The user ID
   * @param {string|number} bookId - The book ID
   * @returns {Object|null} The updated record or null if not found
   */
  static returnBook(userId, bookId) {
    // Find the active borrow record for this user and book
    const record = borrowRecords.find(r => 
      r.userId === parseInt(userId) && 
      r.bookId === parseInt(bookId) && 
      r.status === 'borrowed'
    );
    
    if (!record) {
      return null;
    }
    
    // Update the record
    record.returnDate = new Date().toISOString();
    record.status = 'returned';
    
    return record;
  }

  /**
   * Add some sample borrow records
   */
  static populateSampleData() {
    // No sample borrow records initially
    borrowRecords = [];
  }
}

// Initialize sample data
BorrowRecord.populateSampleData();

module.exports = BorrowRecord; 