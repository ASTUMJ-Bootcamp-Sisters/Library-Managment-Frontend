import { addBook, deleteBook, getAllBooks, updateBook } from "@/api/bookApi";
import { toast } from "@/hooks/use-toast";
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
      const response = await getAllBooks();
      // Handle new standardized backend response format
      const data = response.success ? response.data : response;
      set({ books: data });
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Failed to fetch books";
      set({ error: errorMsg });
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      set({ loading: false });
    }
  },

  saveBook: async () => {
    const { form, editingId, fetchBooks } = get();
    set({ loading: true, error: "" });
    try {
      let response;
      
      if (editingId) {
        response = await updateBook(editingId, form);
        toast({
          title: "Success",
          description: "Book updated successfully",
        });
      } else {
        response = await addBook(form);
        toast({
          title: "Success",
          description: "Book added successfully",
        });
      }
      
      set({ form: initialForm, editingId: null, loading: false });
      fetchBooks();
      return response;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || (editingId ? "Failed to update book" : "Failed to add book");
      set({ error: errorMsg, loading: false });
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      return { success: false, error: errorMsg };
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
    set({ loading: true, error: "" });
    try {
      const response = await deleteBook(id);
      toast({
        title: "Success",
        description: response.message || "Book deleted successfully",
      });
      fetchBooks();
      return { success: true };
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Failed to delete book";
      set({ error: errorMsg, loading: false });
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      return { success: false, error: errorMsg };
    }
  },

  resetForm: () => set({ form: initialForm, editingId: null }),
  setForm: (form) => set({ form }),
}));

export default useBookStore;