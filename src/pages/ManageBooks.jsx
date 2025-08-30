import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useBookStore from "@/store/useBookStore";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const ManageBooks = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  const {
    books,
    form,
    loading,
    error,
    editingId,
    fetchBooks,
    saveBook,
    editBook,
    deleteBookById,
    resetForm,
    setForm
  } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    const newForm = { ...form };

    if (name.startsWith("category.")) {
      const key = name.split(".")[1];
      newForm.category = { ...newForm.category, [key]: value || "" };
    } else if (name.startsWith("copies.")) {
      const key = name.split(".")[1];
      newForm.copies = { ...newForm.copies, [key]: type === "checkbox" ? checked : Number(value) || 0 };
    } else if (name === "available" || name === "year") {
      newForm[name] = Number(value) || 0;
    } else if (type === "checkbox") {
      newForm[name] = checked;
    } else {
      newForm[name] = value || "";
    }
    
    setForm(newForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveBook();
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteBookById(id);
    }
  };

  const handleCancel = () => {
    resetForm();
    setDialogOpen(false);
  };

  const renderFormFields = () => {
    const fields = [
      { key: "title", label: "Title", type: "text" },
      { key: "author", label: "Author", type: "text" },
      { key: "language", label: "Language", type: "text" },
      { key: "publisher", label: "Publisher", type: "text" },
      { key: "year", label: "Year", type: "number" },
      { key: "isbn", label: "ISBN", type: "text" },
      { key: "category.name", label: "Category Name", type: "text" },
      { key: "category.type", label: "Category Type", type: "text" },
      { key: "available", label: "Available Copies", type: "number" },
      { key: "copies.hardCopy", label: "Hard Copies", type: "number" },
      { key: "copies.eBook", label: "eBook Available", type: "checkbox" },
      { key: "image", label: "Image URL", type: "text" },
      { key: "description", label: "Description", type: "textarea", fullWidth: true },
    ];

    return fields.map((field) => {
      const isNested = field.key.includes(".");
      const [parent, child] = isNested ? field.key.split(".") : [field.key, null];
      const value = isNested ? form[parent]?.[child] ?? "" : form[parent] ?? "";
      const checked = field.type === "checkbox" ? !!value : undefined;
      
      const inputClass = field.fullWidth ? "col-span-full" : "col-span-1";

      if (field.type === "textarea") {
        return (
          <div key={field.key} className={`${inputClass} flex flex-col`}>
            <label className="text-sm font-medium text-[#5c4033] mb-1">{field.label}:</label>
            <textarea
              name={field.key}
              value={value}
              onChange={handleChange}
              className="border p-2 rounded resize-y"
            />
          </div>
        );
      }
      if (field.type === "checkbox") {
        return (
          <div key={field.key} className={`${inputClass} flex items-center gap-2`}>
            <label className="text-sm font-medium text-[#5c4033]">{field.label}:</label>
            <input
              type="checkbox"
              name={field.key}
              checked={checked}
              onChange={handleChange}
              className="h-4 w-4"
            />
          </div>
        );
      }
      
      return (
        <div key={field.key} className={`${inputClass} flex flex-col`}>
          <label className="text-sm font-medium text-[#5c4033] mb-1">{field.label}:</label>
          <input
            type={field.type}
            name={field.key}
            value={value}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
      );
    });
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
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All</option>
            {[...new Set(books.map((b) => b.category?.name).filter(Boolean))].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button
              className="bg-[#5c4033] text-white px-4 py-2 rounded hover:bg-[#7b5e57]"
              onClick={resetForm}
            >
              Add Book
            </button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto" style={{ background: '#fdf8f3' }}>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Book" : "Add Book"}</DialogTitle>
            </DialogHeader>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              {renderFormFields()}
              <DialogFooter className="col-span-full flex flex-row gap-2 justify-end mt-4">
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

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div 
          className="overflow-x-auto overflow-y-auto max-h-[60vh] border rounded-md" 
          style={{ background: '#fff' }}
        >
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
                .filter((book) => (categoryFilter ? book.category?.name === categoryFilter : true))
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
                        onClick={() => { editBook(book); setDialogOpen(true); }}
                        className="mr-2 p-2 bg-[#e6d5c3] text-[#5c4033] rounded-full hover:bg-[#f3ebe3]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="p-2 bg-red-200 text-red-700 rounded-full hover:bg-red-300"
                      >
                        <Trash2 size={16} />
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