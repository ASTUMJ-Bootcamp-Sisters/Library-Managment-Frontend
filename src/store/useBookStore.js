import { addBook, deleteBook, getAllBooks, updateBook } from "@/api/bookApi";
import { create } from "zustand";

const initialForm = {
  title: "",
  author: "",
  category: { name: "", type: "" },
  language: "",
  isbn: "",
  publisher: "",
  year: 0,
  available: 0,
  image: "",
  description: "",
  copies: { hardCopy: 0, eBook: false },
};

const useBookStore = create((set, get) => ({
  books: [],
  form: initialForm,
  editingId: null,
  loading: false,
  error: "",

  fetchBooks: async () => {
    set({ loading: true, error: "" });
    try {
      const data = await getAllBooks();
      set({ books: data });
    } catch {
      set({ error: "Failed to fetch books" });
    } finally {
      set({ loading: false });
    }
  },

  saveBook: async () => {
    const { form, editingId, fetchBooks } = get();
    set({ error: "" });
    try {
      if (editingId) {
        await updateBook(editingId, form);
      } else {
        await addBook(form);
      }
      set({ form: initialForm, editingId: null });
      fetchBooks();
    } catch {
      set({ error: "Failed to save book" });
    }
  },

  editBook: (book) =>
    set({
      form: {
        title: book.title || "",
        author: book.author || "",
        category: book.category || { name: "", type: "" },
        language: book.language || "",
        isbn: book.isbn || "",
        publisher: book.publisher || "",
        year: book.year || 0,
        available: book.available || 0,
        image: book.image || "",
        description: book.description || "",
        copies: book.copies || { hardCopy: 0, eBook: false },
      },
      editingId: book._id,
    }),

  deleteBookById: async (id) => {
    const { fetchBooks } = get();
    try {
      await deleteBook(id);
      fetchBooks();
    } catch {
      set({ error: "Failed to delete book" });
    }
  },

  resetForm: () => set({ form: initialForm, editingId: null }),
  setForm: (form) => set({ form }),
}));

export default useBookStore;