import api from "./auth";

export const getBookReviews = async () => {
  const res = await api.get("/book-reviews");
  return res.data;
};

export const createBookReview = async (review) => {
  const res = await api.post("/book-reviews", review);
  return res.data;
};

export const deleteBookReview = async (id) => {
  const res = await api.delete(`/book-reviews/${id}`);
  return res.data;
};
