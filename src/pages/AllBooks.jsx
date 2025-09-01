import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../api/bookApi";
import BookCard from "../components/BookCard";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Borrow dialog fields
  const [dueDate, setDueDate] = useState("");
  const [paymentImage, setPaymentImage] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await getAllBooks();
      // Normalize to array: if response is { success, data }, use data; else fallback to response
      const booksArray = Array.isArray(response) ? response : response?.data || [];
      setBooks(booksArray);
    } catch (err) {
      setBooks([]);
      console.error("Error fetching books:", err);
    }
  };

  const handleBorrow = (book) => {
    setSelectedBook(book);
    setOpenDialog(true);

    // Reset fields
    setDueDate("");
    setPaymentImage(null);
    setNote("");
  };

  const handleConfirmBorrow = () => {
    console.log("Borrow confirmed for:", selectedBook);
    console.log("Due Date:", dueDate);
    console.log("Payment Image:", paymentImage);
    console.log("Note:", note);
    setOpenDialog(false);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-[#fffaf3] via-[#fdf0e0] to-[#e6c9a9] py-3 shadow-md mb-6 flex items-center justify-center gap-3">
        <BookOpen className="w-8 h-8 text-[#4a2c1a]" />
        <h1 className="text-3xl font-extrabold text-[#4a2c1a] tracking-wide font-serif">
          All Books
        </h1>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.isArray(books) && books.length > 0 ? (
          books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onBorrowClick={handleBorrow}
              onViewDetails={() => navigate(`/book/${book._id}`)}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">No books found.</div>
        )}
      </div>

      {/* Borrow Dialog */}
      {selectedBook && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="bg-white max-w-md">
            <DialogHeader>
              <DialogTitle>Borrow Book</DialogTitle>
              <DialogDescription>
                Do you want to borrow <b>{selectedBook.title}</b>?
              </DialogDescription>
            </DialogHeader>

            {/* Borrow Form */}
            <div className="flex flex-col gap-3 mt-4">
              {/* Due Date */}
              <div className="flex flex-col">
                <label className="text-sm font-medium">Due Date</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              {/* Payment Image */}
              <div className="flex flex-col">
                <label className="text-sm font-medium">Payment Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPaymentImage(e.target.files[0])}
                />
              </div>

              {/* Note */}
              <div className="flex flex-col">
                <label className="text-sm font-medium">Note</label>
                <textarea
                  className=" text-black border rounded px-2 py-1"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional note"
                />
              </div>
            </div>

            <DialogFooter className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setOpenDialog(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBorrow}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Confirm
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AllBooks;
