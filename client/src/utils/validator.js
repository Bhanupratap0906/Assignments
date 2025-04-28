/**
 * Validation and Transformation Module
 * 
 * Client-side validation that mirrors the server-side validation logic
 */

/**
 * Validates and transforms input data according to provided schema rules
 * @param {Object} input - The input data to validate and transform
 * @param {Object} schema - The schema containing validation rules
 * @returns {Object} - Result object with valid flag, data, and errors
 */
function validate(input, schema) {
  const result = {
    valid: true,
    data: {},
    errors: []
  };

  // Process each field in the schema
  for (const field in schema) {
    const rules = schema[field];
    const value = input[field];
    
    // Process the field
    const fieldResult = processField(field, value, rules);
    
    // If there are errors, add them to the result
    if (fieldResult.errors.length > 0) {
      result.valid = false;
      result.errors.push(...fieldResult.errors);
    } else if (fieldResult.value !== undefined) {
      // Add the transformed value to the result data
      result.data[field] = fieldResult.value;
    }
  }

  // Perform additional validation for complex rules
  const complexErrors = validateComplexRules(result.data, schema);
  if (complexErrors.length > 0) {
    result.valid = false;
    result.errors.push(...complexErrors);
  }

  // If not valid, remove the data property
  if (!result.valid) {
    delete result.data;
  }

  return result;
}

/**
 * Process a field according to its validation rules
 * @param {string} field - The field name
 * @param {any} value - The field value
 * @param {Object} rules - The validation rules for the field
 * @returns {Object} - Result with value and errors
 */
function processField(field, value, rules) {
  const result = {
    value: value,
    errors: []
  };

  // Check if required
  if (rules.required && (value === undefined || value === null || value === '')) {
    result.errors.push({
      field,
      message: `${field} is required`
    });
    return result;
  }

  // If value is not provided and not required, return with no errors
  if (value === undefined || value === null) {
    return result;
  }

  // Type coercion and validation
  if (rules.type) {
    try {
      result.value = coerceType(value, rules.type);
    } catch (error) {
      result.errors.push({
        field,
        message: `${field} must be a valid ${rules.type}: ${error.message}`
      });
      return result;
    }
  }

  // String transformations
  if (rules.type === 'string' && result.value) {
    // Trim
    if (rules.trim) {
      result.value = result.value.trim();
    }

    // Capitalize
    if (rules.capitalize) {
      result.value = capitalizeString(result.value);
    }

    // Minimum length
    if (rules.minLength && result.value.length < rules.minLength) {
      result.errors.push({
        field,
        message: `${field} must be at least ${rules.minLength} characters long`
      });
    }

    // Maximum length
    if (rules.maxLength && result.value.length > rules.maxLength) {
      result.errors.push({
        field,
        message: `${field} must be at most ${rules.maxLength} characters long`
      });
    }

    // Pattern validation (regex)
    if (rules.pattern && !rules.pattern.test(result.value)) {
      result.errors.push({
        field,
        message: rules.patternMessage || `${field} has an invalid format`
      });
    }
  }

  // Number validations
  if (rules.type === 'number') {
    // Minimum value
    if (rules.min !== undefined && result.value < rules.min) {
      result.errors.push({
        field,
        message: `${field} must be at least ${rules.min}`
      });
    }

    // Maximum value
    if (rules.max !== undefined && result.value > rules.max) {
      result.errors.push({
        field,
        message: `${field} must be at most ${rules.max}`
      });
    }
  }

  // Date validations
  if (rules.type === 'date') {
    // Minimum date
    if (rules.minDate && result.value < rules.minDate) {
      result.errors.push({
        field,
        message: `${field} cannot be before ${rules.minDate.toISOString().split('T')[0]}`
      });
    }

    // Maximum date
    if (rules.maxDate && result.value > rules.maxDate) {
      result.errors.push({
        field,
        message: `${field} cannot be after ${rules.maxDate.toISOString().split('T')[0]}`
      });
    }
  }

  return result;
}

/**
 * Coerce value to the specified type
 * @param {any} value - The value to coerce
 * @param {string} type - The target type
 * @returns {any} - The coerced value
 */
function coerceType(value, type) {
  switch (type) {
    case 'string':
      return String(value);
    
    case 'number':
      const num = Number(value);
      if (isNaN(num)) {
        throw new Error('Invalid number');
      }
      return num;
    
    case 'boolean':
      if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
        throw new Error('Invalid boolean value');
      }
      return Boolean(value);
    
    case 'date':
      if (value instanceof Date) return value;
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date;
    
    case 'array':
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          // Fall through to error
        }
      }
      throw new Error('Invalid array');
    
    default:
      return value;
  }
}

/**
 * Capitalize a string (first letter of each word)
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalizeString(str) {
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Validate complex business rules that involve multiple fields
 * @param {Object} data - The data object to validate
 * @param {Object} schema - The schema containing validation rules
 * @returns {Array} - Array of error objects
 */
function validateComplexRules(data, schema) {
  const errors = [];

  // ISBN validation
  if (data.isbn) {
    const isbnPattern = /^(?:\d[- ]?){9}[\dXx]$|^(?:\d[- ]?){13}$|^\d{9}[\dXx]$|^\d{13}$/;
    if (!isbnPattern.test(data.isbn.replace(/[- ]/g, ''))) {
      errors.push({
        field: 'isbn',
        message: 'ISBN must be a valid ISBN-10 or ISBN-13 format'
      });
    }
  }

  // Published date cannot be in the future
  if (data.publishedDate && data.publishedDate > new Date()) {
    errors.push({
      field: 'publishedDate',
      message: 'Published date cannot be in the future'
    });
  }

  // If genre is Academic, copies available must be at least 5
  if (data.genre === 'Academic' && data.copiesAvailable !== undefined && data.copiesAvailable < 5) {
    errors.push({
      field: 'copiesAvailable',
      message: 'Academic books must have at least 5 copies available'
    });
  }

  return errors;
}

// Book validation schema
const bookSchema = {
  title: {
    type: 'string',
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100
  },
  author: {
    type: 'string',
    required: true,
    trim: true,
    capitalize: true,
    minLength: 2,
    maxLength: 100
  },
  isbn: {
    type: 'string',
    required: true,
    trim: true,
    pattern: /^(?:\d[- ]?){9}[\dXx]$|^(?:\d[- ]?){13}$|^\d{9}[\dXx]$|^\d{13}$/,
    patternMessage: 'ISBN must be a valid ISBN-10 or ISBN-13 format'
  },
  publishedDate: {
    type: 'date',
    required: true,
    maxDate: new Date()
  },
  genre: {
    type: 'string',
    trim: true,
    capitalize: true
  },
  description: {
    type: 'string',
    trim: true,
    maxLength: 1000
  },
  copiesAvailable: {
    type: 'number',
    min: 0
  },
  totalCopies: {
    type: 'number',
    min: 0
  }
};

// User validation schema
const userSchema = {
  name: {
    type: 'string',
    required: true,
    trim: true,
    capitalize: true,
    minLength: 2,
    maxLength: 100
  },
  email: {
    type: 'string',
    required: true,
    trim: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    patternMessage: 'Email must be a valid email address'
  },
  membershipDate: {
    type: 'date',
    maxDate: new Date()
  }
};

export {
  validate,
  bookSchema,
  userSchema
}; 