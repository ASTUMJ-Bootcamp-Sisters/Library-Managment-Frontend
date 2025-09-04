import { create } from 'zustand';
import {
    approveBorrowRequest,
    borrowBook,
    getAdminBorrowHistory,
    getPendingBorrows,
    getStudentBorrowHistory,
    rejectBorrowRequest,
    returnBook
} from '../api/borrowApi';
import { toast } from '../hooks/use-toast';

const useBorrowStore = create((set, get) => ({
  // State
  pendingBorrows: [],
  userBorrows: [],
  borrowHistory: [],
  adminBorrowHistory: [],
  isLoading: false,
  error: null,
  
  // Get pending borrows (admin)
  fetchPendingBorrows: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getPendingBorrows();
      // Handle new standardized response format
      const data = response.success ? response.data : response;
      set({ pendingBorrows: data, isLoading: false });
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Failed to fetch pending borrow requests";
      set({ error: errorMsg, isLoading: false });
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
    }
  },
  
  // Approve a borrow request (admin)
  approveBorrow: async (borrowId) => {
    set({ isLoading: true, error: null });
    try {
      if (!borrowId) {
        throw new Error("Borrow ID is required");
      }
      
      const result = await approveBorrowRequest(borrowId);
      
      // Update the state to reflect the change
      await get().fetchPendingBorrows();
      
      toast({
        title: "Success",
        description: result.message || "Borrow request approved successfully"
      });
      
      set({ isLoading: false });
      return { success: true, data: result };
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error.message || "Failed to approve borrow request";
      console.error("Error approving borrow:", error);
      set({ error: errorMsg, isLoading: false });
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      
      return { success: false, error: errorMsg };
    }
  },
  
  // Reject a borrow request (admin)
  rejectBorrow: async (borrowId) => {
    set({ isLoading: true, error: null });
    try {
      if (!borrowId) {
        throw new Error("Borrow ID is required");
      }
      
      const result = await rejectBorrowRequest(borrowId);
      
      // Update the state to reflect the change
      await get().fetchPendingBorrows();
      
      toast({
        title: "Success",
        description: result.message || "Borrow request rejected successfully"
      });
      
      set({ isLoading: false });
      return { success: true, data: result };
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error.message || "Failed to reject borrow request";
      console.error("Error rejecting borrow:", error);
      set({ error: errorMsg, isLoading: false });
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      
      return { success: false, error: errorMsg };
    }
  },
  
  // Borrow a book (student)
  borrowBook: async (bookId, duration) => {
    set({ isLoading: true, error: null });
    try {
      // Validate input
      if (!bookId) {
        throw new Error("Book ID is required");
      }
      
      if (!duration) {
        throw new Error("Duration is required");
      }
      
      const result = await borrowBook(bookId, duration);
      
      toast({
        title: "Success",
        description: result.message || "Borrowing request submitted successfully"
      });
      
      set({ isLoading: false });
      return { success: true, data: result };
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error.message || "Failed to borrow book";
      console.error("Error borrowing book:", error);
      set({ error: errorMsg, isLoading: false });
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      
      return { success: false, error: errorMsg };
    }
  },
  
  // Return a book (student)
  returnBook: async (borrowId) => {
    set({ isLoading: true, error: null });
    try {
      // Validate borrowId
      if (!borrowId) {
        throw new Error("Borrow ID is required");
      }
      
      const result = await returnBook(borrowId);
      
      // Automatically refresh borrow history after returning
      get().fetchStudentBorrowHistory();
      
      toast({
        title: "Success",
        description: result.message || "Book returned successfully"
      });
      
      set({ isLoading: false });
      return { success: true, data: result };
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error.message || "Failed to return book";
      console.error("Error returning book:", error);
      set({ error: errorMsg, isLoading: false });
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      
      return { success: false, error: errorMsg };
    }
  },
  
  // Clear errors
  clearError: () => set({ error: null }),
  
  // Get borrow history for the logged-in student
  fetchStudentBorrowHistory: async (statusFilter = null) => {
    set({ isLoading: true, error: null });
    try {
      let params = {};
      if (statusFilter) {
        params = { status: statusFilter };
      }
      
      const response = await getStudentBorrowHistory(params);
      // Handle new standardized response format
      const data = response.success ? response.data : response;
      
      set({ borrowHistory: data, isLoading: false });
      return { success: true, data };
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Failed to fetch borrow history";
      console.error("Error fetching student borrow history:", error);
      set({ error: errorMsg, isLoading: false });
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      
      return { success: false, error: errorMsg };
    }
  },
  
  // Get borrow history for admin view (all students or specific student)
  fetchAdminBorrowHistory: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Handle various filters: studentId, status, bookId, date range
      const response = await getAdminBorrowHistory(filters);
      // Handle new standardized response format
      const data = response.success ? response.data : response;
      
      set({ adminBorrowHistory: data, isLoading: false });
      return { success: true, data };
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Failed to fetch admin borrow history";
      console.error("Error fetching admin borrow history:", error);
      set({ error: errorMsg, isLoading: false });
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      
      return { success: false, error: errorMsg };
    }
  }
}));

export default useBorrowStore;
