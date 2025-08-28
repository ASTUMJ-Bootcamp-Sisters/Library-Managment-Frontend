
import {
    addBook,
    deleteBook,
    getAllBooks,
    updateBook,
} from "@/api/bookApi";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  author: "",
  category: { name: "", type: "" },
  language: "",
  isbn: "",
  available: 0,
  image: "",
  description: "",
  copies: { hardCopy: 0, eBook: false },
};

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getAllBooks();
      setBooks(data);
    } catch (err) {
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Handle nested fields
    if (name.startsWith("category.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        category: { ...prev.category, [key]: value },
      }));
    } else if (name.startsWith("copies.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        copies: {
          ...prev.copies,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name === "available" || name === "copies.hardCopy") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateBook(editingId, form);
      } else {
        await addBook(form);
      }
      setForm(initialForm);
      setEditingId(null);
      setDialogOpen(false);
      fetchBooks();
    } catch (err) {
      setError("Failed to save book");
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title || "",
      author: book.author || "",
      category: book.category || { name: "", type: "" },
      language: book.language || "",
      isbn: book.isbn || "",
      available: book.available || 0,
      image: book.image || "",
      description: book.description || "",
      copies: book.copies || { hardCopy: 0, eBook: false },
    });
    setEditingId(book._id);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBook(id);
      fetchBooks();
    } catch (err) {
      setError("Failed to delete book");
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setDialogOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#5c4033] mb-4">Manage Books</h1>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <label className="mr-2 text-[#5c4033] font-medium">Filter by Category:</label>
          <select
            className="border p-2 rounded"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="">All</option>
            {[...new Set(books.map(b => b.category?.name).filter(Boolean))].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button
              className="bg-[#5c4033] text-white px-4 py-2 rounded hover:bg-[#7b5e57]"
              onClick={() => {
                setForm(initialForm);
                setEditingId(null);
              }}
            >
              Add Book
            </button>
          </DialogTrigger>
          <DialogContent style={{ background: '#fdf8f3' }}>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Book" : "Add Book"}</DialogTitle>
            </DialogHeader>
            <form className="flex flex-wrap gap-4 items-end" onSubmit={handleSubmit}>
              <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                name="author"
                placeholder="Author"
                value={form.author}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                name="category.name"
                placeholder="Category Name"
                value={form.category.name}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                name="category.type"
                placeholder="Category Type"
                value={form.category.type}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                name="language"
                placeholder="Language"
                value={form.language}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                name="isbn"
                placeholder="ISBN"
                value={form.isbn}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                name="available"
                placeholder="Available"
                value={form.available}
                onChange={handleChange}
                className="border p-2 rounded"
                type="number"
              />
              <input
                name="copies.hardCopy"
                placeholder="Hard Copies"
                value={form.copies.hardCopy}
                onChange={handleChange}
                className="border p-2 rounded"
                type="number"
              />
              <label className="flex items-center gap-2">
                <input
                  name="copies.eBook"
                  type="checkbox"
                  checked={form.copies.eBook}
                  onChange={handleChange}
                />
                eBook
              </label>
              <input
                name="image"
                placeholder="Image URL"
                value={form.image}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="border p-2 rounded w-64"
              />
              <DialogFooter className="w-full flex flex-row gap-2 justify-end mt-4">
                <button
                  type="submit"
                  className="bg-[#5c4033] text-white px-4 py-2 rounded hover:bg-[#7b5e57]"
                >
                  {editingId ? "Update" : "Add"} Book
                </button>
                <DialogClose asChild>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded border border-[#5c4033] text-[#5c4033]"
                  >
                    Cancel
                  </button>
                </DialogClose>
              </DialogFooter>
            </form>
            {error && <div className="text-red-500 mb-2">{error}</div>}
          </DialogContent>
        </Dialog>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto" style={{ background: '#fff' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books
                .filter((book) =>
                  categoryFilter ? book.category?.name === categoryFilter : true
                )
                .map((book) => (
                  <TableRow key={book._id} className="text-center">
                    <TableCell>
                      {book.image && (
                        <img src={book.image} alt={book.title} className="h-12 w-10 object-cover mx-auto rounded" />
                      )}
                    </TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.category?.name}</TableCell>
                    <TableCell>{book.available}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleEdit(book)}
                        className="mr-2 px-3 py-1 bg-[#e6d5c3] text-[#5c4033] rounded hover:bg-[#f3ebe3]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="px-3 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
