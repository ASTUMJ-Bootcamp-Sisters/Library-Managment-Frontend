import React, { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import BookForm from "../components/BookForm";
import { getAllBooks, addBook, updateBook, deleteBook } from "../api/bookApi";
import { Button } from "@/components/ui/button";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const data = await getAllBooks();
    setBooks(data);
  };

  const handleFormSubmit = async (data) => {
    if (editingBook) {
      // UPDATE
      const updated = await updateBook(editingBook._id, data);
      setBooks(books.map((b) => (b._id === updated._id ? updated : b)));
      setEditingBook(null);
    } else {
      // ADD
      const newBook = await addBook(data);
      setBooks([...books, newBook]);
    }
    setFormOpen(false);
  };

  const handleDelete = async (id) => {
    await deleteBook(id);
    setBooks(books.filter((b) => b._id !== id));
  };

  const openAddForm = () => {
    setEditingBook(null);
    setFormOpen(true);
  };

  const openEditForm = (book) => {
    setEditingBook(book);
    setFormOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">All Books</h2>
        <Button className="bg-black text-white" onClick={openAddForm}>
          + Add Book
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book) => (
          <BookCard
            key={book._id}
            book={book}
            onEdit={() => openEditForm(book)}
            onDelete={() => handleDelete(book._id)}
          />
        ))}
      </div>

      {formOpen && (
        <BookForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingBook(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={editingBook}
        />
      )}
    </div>
  );
};

export default AllBooks;
