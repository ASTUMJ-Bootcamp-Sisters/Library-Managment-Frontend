import { create } from 'zustand';
import {
    approveBorrowRequest,
    borrowBook,
    getPendingBorrows,
    rejectBorrowRequest,
    returnBook
} from '../api/borrowApi';

const useBorrowStore = create((set, get) => ({
  // State
  pendingBorrows: [],
  userBorrows: [],
  isLoading: false,
  error: null,
  
  // Get pending borrows (admin)
  fetchPendingBorrows: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getPendingBorrows();
      set({ pendingBorrows: data, isLoading: false });
    } catch (error) {
      set({ error: error.toString(), isLoading: false });
    }
  },
  
  // Approve a borrow request (admin)
  approveBorrow: async (borrowId) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Zustand Store: Approving borrow request with ID:", borrowId);
      const result = await approveBorrowRequest(borrowId);
      
      // Update the state to reflect the change
      await get().fetchPendingBorrows();
      
      set({ isLoading: false });
      return { success: true, data: result };
    } catch (error) {
      console.error("Zustand Store: Error approving borrow:", error);
      set({ error: error.toString(), isLoading: false });
      return { success: false, error: error.toString() };
    }
  },
  
  // Reject a borrow request (admin)
  rejectBorrow: async (borrowId) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Zustand Store: Rejecting borrow request with ID:", borrowId);
      const result = await rejectBorrowRequest(borrowId);
      
      // Update the state to reflect the change
      await get().fetchPendingBorrows();
      
      set({ isLoading: false });
      return { success: true, data: result };
    } catch (error) {
      console.error("Zustand Store: Error rejecting borrow:", error);
      set({ error: error.toString(), isLoading: false });
      return { success: false, error: error.toString() };
    }
  },
  
  // Borrow a book (student)
  borrowBook: async (bookId, duration) => {
    set({ isLoading: true, error: null });
    try {
      const result = await borrowBook(bookId, duration);
      set({ isLoading: false });
      return { success: true, data: result };
    } catch (error) {
      set({ error: error.toString(), isLoading: false });
      return { success: false, error };
    }
  },
  
  // Return a book (student)
  returnBook: async (borrowId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await returnBook(borrowId);
      set({ isLoading: false });
      return { success: true, data: result };
    } catch (error) {
      set({ error: error.toString(), isLoading: false });
      return { success: false, error };
    }
  },
  
  // Clear errors
  clearError: () => set({ error: null })
}));

export default useBorrowStore;
