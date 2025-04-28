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
      set({ users: response.data, isLoading: false });
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
      set({ selectedUser: response.data, isLoading: false });
      return response.data;
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
      set(state => ({ 
        users: [...state.users, response.data], 
        isLoading: false 
      }));
      return response.data;
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
      set(state => ({
        users: state.users.map(user => 
          user.id === parseInt(id) ? response.data : user
        ),
        selectedUser: response.data,
        isLoading: false
      }));
      return response.data;
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
      
      // Update the selected user and the user in the users array
      const updatedUser = response.data.user;
      
      set(state => ({
        users: state.users.map(user => 
          user.id === parseInt(userId) ? updatedUser : user
        ),
        selectedUser: updatedUser,
        isLoading: false
      }));
      
      return response.data;
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
      
      // Update the selected user and the user in the users array
      const updatedUser = response.data.user;
      
      set(state => ({
        users: state.users.map(user => 
          user.id === parseInt(userId) ? updatedUser : user
        ),
        selectedUser: updatedUser,
        isLoading: false
      }));
      
      return response.data;
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