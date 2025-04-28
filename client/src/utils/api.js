import { mockBookApi, mockUserApi } from './mockApi';

const USE_MOCK_API = true;

const API_BASE_URL = '/api';

async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    const clonedResponse = response.clone();
    
    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        try {
          const textContent = await clonedResponse.text();
          if (textContent) {
            errorMessage = `${errorMessage}: ${textContent.substring(0, 100)}${textContent.length > 100 ? '...' : ''}`;
          }
        } catch (textError) {
        }
      }
      
      throw {
        status: response.status,
        message: errorMessage
      };
    }
    
    try {
      const data = await response.json();
      return data;
    } catch (parseError) {
      console.warn('Response is not JSON, returning empty object', parseError);
      return {};
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

function createApiWithFallback(realApiFn, mockApiFn) {
  return async (...args) => {
    if (USE_MOCK_API) {
      console.log('Using mock API');
      return mockApiFn(...args);
    }
    
    try {
      return await realApiFn(...args);
    } catch (error) {
      console.warn('Real API failed, falling back to mock:', error);
      return mockApiFn(...args);
    }
  };
}

const realBookApi = {
  getAll: () => apiRequest('/books'),
  getById: (id) => apiRequest(`/books/${id}`),
  create: (bookData) => apiRequest('/books', {
    method: 'POST',
    body: JSON.stringify(bookData)
  }),
  update: (id, bookData) => apiRequest(`/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookData)
  }),
  delete: (id) => apiRequest(`/books/${id}`, {
    method: 'DELETE'
  })
};

const realUserApi = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  create: (userData) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  update: (id, userData) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),
  delete: (id) => apiRequest(`/users/${id}`, {
    method: 'DELETE'
  }),
  borrowBook: (userId, bookId) => apiRequest(`/users/${userId}/borrow`, {
    method: 'POST',
    body: JSON.stringify({ bookId })
  }),
  returnBook: (userId, bookId) => apiRequest(`/users/${userId}/return`, {
    method: 'POST',
    body: JSON.stringify({ bookId })
  })
};

export const bookApi = {
  getAll: createApiWithFallback(realBookApi.getAll, mockBookApi.getAll),
  getById: createApiWithFallback(realBookApi.getById, mockBookApi.getById),
  create: createApiWithFallback(realBookApi.create, mockBookApi.create),
  update: createApiWithFallback(realBookApi.update, mockBookApi.update),
  delete: createApiWithFallback(realBookApi.delete, mockBookApi.delete)
};

export const userApi = {
  getAll: createApiWithFallback(realUserApi.getAll, mockUserApi.getAll),
  getById: createApiWithFallback(realUserApi.getById, mockUserApi.getById),
  create: createApiWithFallback(realUserApi.create, mockUserApi.create),
  update: createApiWithFallback(realUserApi.update, mockUserApi.update),
  delete: createApiWithFallback(realUserApi.delete, mockUserApi.delete),
  borrowBook: createApiWithFallback(realUserApi.borrowBook, mockUserApi.borrowBook),
  returnBook: createApiWithFallback(realUserApi.returnBook, mockUserApi.returnBook)
};
