/**
 * User Store
 * 
 * State management for users using Zustand
 */

import { create } from 'zustand';
import { userApi } from '../utils/api';

const useUserStore = create((set, get) => ({
  // State
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  
  // Actions
  
  // Load all users
  loadUsers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await userApi.getAll();
      const users = Array.isArray(response) ? response : 
                   (response.data ? response.data : []);
      set({ users, isLoading: false });
    } catch (error) {
      set({ 
        error: error.message || 'Failed to load users', 
        isLoading: false 
      });
    }
  },
  
  // Get a user by ID
  getUser: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await userApi.getById(id);
      const user = response.data || response;
      set({ selectedUser: user, isLoading: false });
      return user;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to load user', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // Add a new user
  addUser: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await userApi.create(userData);
      const user = response.data || response;
      set(state => ({ 
        users: [...state.users, user], 
        isLoading: false 
      }));
      return user;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to add user', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Update a user
  updateUser: async (id, userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await userApi.update(id, userData);
      const user = response.data || response;
      set(state => ({
        users: state.users.map(item => 
          item.id === parseInt(id) ? user : item
        ),
        selectedUser: user,
        isLoading: false
      }));
      return user;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to update user', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Delete a user
  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await userApi.delete(id);
      set(state => ({
        users: state.users.filter(user => user.id !== parseInt(id)),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to delete user', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Borrow a book
  borrowBook: async (userId, bookId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await userApi.borrowBook(userId, bookId);
      const result = response.data || response;
      const updatedUser = result.user;
      
      set(state => ({
        users: state.users.map(user => 
          user.id === parseInt(userId) ? updatedUser : user
        ),
        selectedUser: updatedUser,
        isLoading: false
      }));
      
      return result;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to borrow book', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Return a book
  returnBook: async (userId, bookId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await userApi.returnBook(userId, bookId);
      const result = response.data || response;
      const updatedUser = result.user;
      
      set(state => ({
        users: state.users.map(user => 
          user.id === parseInt(userId) ? updatedUser : user
        ),
        selectedUser: updatedUser,
        isLoading: false
      }));
      
      return result;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to return book', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Clear selected user
  clearSelectedUser: () => {
    set({ selectedUser: null });
  },
  
  // Clear errors
  clearError: () => {
    set({ error: null });
  }
}));

export default useUserStore; 