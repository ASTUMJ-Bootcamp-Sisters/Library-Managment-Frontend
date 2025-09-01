import api from "./auth";
const BASE_URL = "/books";

// Get all books
export const getAllBooks = async () => {
  try {
    const res = await api.get(BASE_URL);
    return res.data; // Either { success: true, data: [] } or direct array
  } catch (err) {
    console.error("Error fetching books:", err);
    // Enhanced error handling
    const errorMessage = err.response?.data?.message || "Failed to fetch books";
    throw { 
      ...err, 
      message: errorMessage,
      response: {
        ...err.response,
        data: { 
          ...(err.response?.data || {}), 
          message: errorMessage
        }
      }
    };
  }
};

// Get book by ID
export const getBookById = async (bookId) => {
  try {
    if (!bookId) {
      throw new Error("Book ID is required");
    }
    const res = await api.get(`${BASE_URL}/${bookId}`);
    return res.data; // Either { success: true, data: {} } or direct object
  } catch (err) {
    console.error("Error fetching book by ID:", err);
    // Enhanced error handling
    const errorMessage = err.response?.data?.message || "Failed to fetch book";
    throw { 
      ...err, 
      message: errorMessage,
      response: {
        ...err.response,
        data: { 
          ...(err.response?.data || {}), 
          message: errorMessage
        }
      }
    };
  }
};

// Add a book
export const addBook = async (bookData) => {
  try {
    // Validate required fields
    if (!bookData.title || !bookData.author) {
      throw new Error("Title and author are required");
    }
    
    const res = await api.post(BASE_URL, bookData);
    return res.data; // { success: true, message: "Book added successfully", data: {} }
  } catch (err) {
    console.error("Error adding book:", err);
    // Enhanced error handling
    const errorMessage = err.response?.data?.message || err.message || "Failed to add book";
    throw { 
      ...err, 
      message: errorMessage,
      response: {
        ...err.response,
        data: { 
          ...(err.response?.data || {}), 
          message: errorMessage
        }
      }
    };
  }
};

// Update a book
export const updateBook = async (bookId, bookData) => {
  try {
    // Validate ID
    if (!bookId) {
      throw new Error("Book ID is required");
    }
    
    const res = await api.put(`${BASE_URL}/${bookId}`, bookData);
    return res.data; // { success: true, message: "Book updated successfully", data: {} }
  } catch (err) {
    console.error("Error updating book:", err);
    // Enhanced error handling
    const errorMessage = err.response?.data?.message || "Failed to update book";
    throw { 
      ...err, 
      message: errorMessage,
      response: {
        ...err.response,
        data: { 
          ...(err.response?.data || {}), 
          message: errorMessage
        }
      }
    };
  }
};

// Delete a book
export const deleteBook = async (bookId) => {
  try {
    // Validate ID
    if (!bookId) {
      throw new Error("Book ID is required");
    }
    
    const res = await api.delete(`${BASE_URL}/${bookId}`);
    return res.data; // { success: true, message: "Book deleted successfully" }
  } catch (err) {
    console.error("Error deleting book:", err);
    // Enhanced error handling
    const errorMessage = err.response?.data?.message || "Failed to delete book";
    throw { 
      ...err, 
      message: errorMessage,
      response: {
        ...err.response,
        data: { 
          ...(err.response?.data || {}), 
          message: errorMessage
        }
      }
    };
  }
};

// Add comment to a book
export const addComment = async (bookId, data) => {
  try {
    // Validate required fields
    if (!bookId) {
      throw new Error("Book ID is required");
    }
    
    if (!data.text || data.text.trim() === '') {
      throw new Error("Comment text is required");
    }
    
    const res = await api.post(`${BASE_URL}/comment`, { bookId, ...data });
    return res.data; // { success: true, message: "Comment added successfully", data: {} }
  } catch (err) {
    console.error("Error adding comment:", err);
    // Enhanced error handling
    const errorMessage = err.response?.data?.message || err.message || "Failed to add comment";
    throw { 
      ...err, 
      message: errorMessage,
      response: {
        ...err.response,
        data: { 
          ...(err.response?.data || {}), 
          message: errorMessage
        }
      }
    };
  }
};

// Rate a book
export const rateBook = async (bookId, data) => {
  try {
    // Validate required fields
    if (!bookId) {
      throw new Error("Book ID is required");
    }
    
    if (data.value === undefined || data.value === null) {
      throw new Error("Rating value is required");
    }
    
    if (data.value < 1 || data.value > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    
    const res = await api.post(`${BASE_URL}/rate`, { bookId, ...data });
    return res.data; // { success: true, message: "Book rated successfully", data: {} }
  } catch (err) {
    console.error("Error rating book:", err);
    // Enhanced error handling
    const errorMessage = err.response?.data?.message || err.message || "Failed to rate book";
    throw { 
      ...err, 
      message: errorMessage,
      response: {
        ...err.response,
        data: { 
          ...(err.response?.data || {}), 
          message: errorMessage
        }
      }
    };
  }
};
