import api from "./auth";
const BASE_URL = "/books";

// Get all books
export const getAllBooks = async () => {
  try {
    const res = await api.get(BASE_URL);
    return res.data;  // array of all books
  } catch (err) {
    console.error("Error fetching books:", err);
    throw err;
  }
};

// Get book by ID
export const getBookById = async (bookId) => {
  try {
    const res = await api.get(`${BASE_URL}/${bookId}`);
    return res.data; // single book object
  } catch (err) {
    console.error("Error fetching book by ID:", err);
    throw err;
  }
};

// Add a book
export const addBook = async (bookData) => {
  try {
    const res = await api.post(BASE_URL, bookData);
    return res.data; // newly created book
  } catch (err) {
    console.error("Error adding book:", err);
    throw err;
  }
};

// Update a book
export const updateBook = async (bookId, bookData) => {
  try {
    const res = await api.put(`${BASE_URL}/${bookId}`, bookData);
    return res.data; // updated book object
  } catch (err) {
    console.error("Error updating book:", err);
    throw err;
  }
};

// Delete a book
export const deleteBook = async (bookId) => {
  try {
    const res = await api.delete(`${BASE_URL}/${bookId}`);
    return res.data; // { message: "Book deleted successfully" }
  } catch (err) {
    console.error("Error deleting book:", err);
    throw err;
  }
};

// Add comment to a book
export const addComment = async (bookId, data) => {
  try {
    const res = await api.post(`${BASE_URL}/comment`, { bookId, ...data });
    return res.data;
  } catch (err) {
    console.error("Error adding comment:", err);
    throw err;
  }
};

// Rate a book
export const rateBook = async (bookId, data) => {
  try {
    const res = await api.post(`${BASE_URL}/rate`, { bookId, ...data });
    return res.data;
  } catch (err) {
    console.error("Error rating book:", err);
    throw err;
  }
};
