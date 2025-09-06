import api from './axios';
// Add a book to favorites
export const addFavorite = async (data) => {
  return await api.post("/favorites", data);
};

// Remove a book from favorites
export const removeFavorite = async (bookId) => {
  return await api.delete(`/favorites/${bookId}`);
};

// Check if book is in favorites
export const checkFavorite = async (bookId) => {
  return await api.get(`/favorites/${bookId}`);
};
