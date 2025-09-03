import api from './axios';

// Admin: Get pending borrowing requests
export const getPendingBorrows = async () => {
  try {
    const response = await api.get('/borrow/pending');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch pending requests';
  }
};

// Admin: Approve a borrow request
export const approveBorrowRequest = async (borrowId) => {
  try {
    // Using :id parameter as defined in the backend route
    const response = await api.put(`/borrow/approve/${borrowId}`);
    return response.data;
  } catch (error) {
    console.error("Error approving borrow request:", error);
    throw error.response?.data?.message || 'Failed to approve request';
  }
};

// Admin: Reject a borrow request
export const rejectBorrowRequest = async (borrowId) => {
  try {
    const response = await api.delete(`/borrow/reject/${borrowId}`);
    return response.data;
  } catch (error) {
    console.error("Error rejecting borrow request:", error);
    throw error.response?.data?.message || 'Failed to reject request';
  }
};

// Student: Borrow a book
export const borrowBook = async (formData) => {
  try {
    // Using FormData to support file uploads for non-members
    // Make sure the field names match what the backend expects:
    // - idCardImage: For ID card image upload
    // - paymentImage: For payment proof image upload
    const response = await api.post('/borrow', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to borrow book';
  }
};

// Student: Return a book
export const returnBook = async (borrowId) => {
  try {
    const response = await api.post('/borrow/return', { borrowId });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to return book';
  }
};

// Student: Get own borrow history
export const getStudentBorrowHistory = async () => {
  try {
    const response = await api.get('/borrow/history');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch borrow history';
  }
};

// Admin: Get all borrow history or for specific student (supports filter object)
export const getAdminBorrowHistory = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value);
    });
    const url = '/borrow/admin/history' + (params.toString() ? `?${params}` : '');
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch borrow history';
  }
};
