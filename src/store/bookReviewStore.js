import { create } from "zustand";
import { createBookReview, deleteBookReview, getBookReviews } from "../api/bookReviewApi";

const useBookReviewStore = create((set) => ({
  reviews: [],
  loading: false,
  error: null,
  fetchReviews: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getBookReviews();
      set({ reviews: data, loading: false });
    } catch (err) {
      set({ error: err.message || "Failed to fetch reviews", loading: false });
    }
  },
  addReview: async (review) => {
    set({ loading: true, error: null });
    try {
      await createBookReview(review);
      await useBookReviewStore.getState().fetchReviews();
    } catch (err) {
      set({ error: err.message || "Failed to add review", loading: false });
    }
  },
  deleteReview: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteBookReview(id);
      await useBookReviewStore.getState().fetchReviews();
    } catch (err) {
      set({ error: err.message || "Failed to delete review", loading: false });
    }
  },
}));

export default useBookReviewStore;
