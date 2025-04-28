/**
 * Validation Middleware
 * 
 * Validates request data against defined schemas
 */

const { validate } = require('../utils/validator');

/**
 * Middleware factory that validates request body against a schema
 * @param {Object} schema - Validation schema to use
 * @returns {Function} Express middleware function
 */
function validateRequest(schema) {
  return (req, res, next) => {
    // Validate the request body against the schema
    const result = validate(req.body, schema);
    
    if (!result.valid) {
      // If validation fails, send back a 400 response with the errors
      return res.status(400).json({
        success: false,
        errors: result.errors
      });
    }
    
    // If validation passes, replace the request body with the validated/transformed data
    req.body = result.data;
    
    // Continue to the next middleware or controller
    next();
  };
}

module.exports = validateRequest; 