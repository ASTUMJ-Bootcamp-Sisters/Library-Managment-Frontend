import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../api/bookApi";
import BookCard from "../components/BookCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [dueDate, setDueDate] = useState("");
  const [paymentImage, setPaymentImage] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await getAllBooks();
      const booksArray = Array.isArray(response) ? response : response?.data || [];
      setBooks(booksArray);
    } catch (err) {
      console.error("Error fetching books:", err);
      setBooks([]);
    }
  };

  const handleBorrow = (book) => {
    setSelectedBook(book);
    setOpenDialog(true);
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
    <div className="bg-white min-h-screen flex flex-col">
      {/* Sticky Header (inside page only) */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-[#fffaf3] via-[#fdf0e0] to-[#e6c9a9] py-4 shadow-md flex items-center justify-center gap-3 h-[80px]">
        <BookOpen className="w-8 h-8 text-[#4a2c1a]" />
        <h1 className="text-3xl font-extrabold text-[#4a2c1a] tracking-wide font-serif">
          All Books
        </h1>
      </div>

      {/* Scrollable Books Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {books.length > 0 ? (
            books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onBorrowClick={handleBorrow}
                onViewDetails={() => navigate(`/book/${book._id}`)}
                className="hover:scale-105 transition-transform duration-200"
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No books found.
            </div>
          )}
        </div>
      </div>

      {selectedBook && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="bg-white max-w-md">
            <DialogHeader>
              <DialogTitle>Borrow Book</DialogTitle>
              <DialogDescription>
                Do you want to borrow <b>{selectedBook.title}</b>?
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 mt-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Due Date</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium">Payment Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPaymentImage(e.target.files[0])}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium">Note</label>
                <textarea
                  className="border rounded px-2 py-1 text-black"
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
