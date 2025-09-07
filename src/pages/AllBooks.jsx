import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../api/bookApi";
import { borrowBook } from "../api/borrowApi";
import BookCard from "../components/BookCard";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { toast } from "../hooks/use-toast";
import useMembershipStore from "../store/membershipStore";

const AllBooks = () => {
  const { membership, getMembershipStatus } = useMembershipStore();

  useEffect(() => {
    getMembershipStatus();
  }, [getMembershipStatus]);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const categories = [...new Set(books.map(b => b.category?.name).filter(Boolean))];
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [borrowDuration, setBorrowDuration] = useState("1w");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idCardImage, setIdCardImage] = useState(null);
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
    setBorrowDuration("1w");
    setIdCardImage(null);
    setPaymentImage(null);
    setNote("");
  };

  const handleConfirmBorrow = async () => {
    if (!selectedBook) return;
    const isMember = membership?.status === "Active";
    if (!isMember) {
      if (!idCardImage || !paymentImage) {
        toast({
          title: "Missing Uploads",
          description: "Non-members must upload both ID card and payment images.",
          variant: "destructive"
        });
        return;
      }
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("bookId", selectedBook._id);
    formData.append("duration", borrowDuration);
    if (note) formData.append("note", note);
    if (isMember) {
      if (paymentImage) formData.append("paymentImage", paymentImage);
    } else {
      formData.append("idCardImage", idCardImage);
      formData.append("paymentImage", paymentImage);
    }
    try {
      await borrowBook(formData);
      toast({
        title: "Success!",
        description: "Borrow request submitted!",
        variant: "default"
      });
      setOpenDialog(false);
      setBorrowDuration("1w");
      setIdCardImage(null);
      setPaymentImage(null);
      setNote("");
    } catch (err) {
      toast({
        title: "Error",
        description: typeof err === "string" ? err : (err?.message || "Failed to borrow book"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Modern Heading - not sticky, better spacing */}
      <div className="bg-gradient-to-r from-[#fffaf3] via-[#fdf0e0] to-[#e6c9a9] py-6 px-4 shadow-md flex flex-col items-center justify-center gap-2 mb-2 rounded-b-2xl">
        <div className="flex items-center gap-3 justify-center">
          <BookOpen className="w-10 h-10 text-[#4a2c1a] drop-shadow-lg" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#4a2c1a] tracking-wide font-serif drop-shadow-lg">
            All Books
          </h1>
        </div>
        <div className="w-24 h-1 bg-gradient-to-r from-[#e6d5c3] via-[#fdf0e0] to-[#e6c9a9] rounded-full mt-2" />
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between px-4 py-4 bg-[#fdf8f3] border-b border-[#e6d5c3] mb-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="category" className="font-medium text-[#4a2c1a]">Category:</label>
          <select
            id="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border rounded px-2 py-2 bg-white text-[#4a2c1a]"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-2 w-full text-[#4a2c1a] bg-white"
          />
        </div>
      </div>

      {/* Scrollable Books Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {books
            .filter(book =>
              (category === "All" || book.category?.name === category) &&
              (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .length > 0 ? (
            books
              .filter(book =>
                (category === "All" || book.category?.name === category) &&
                (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  book.author.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map((book) => (
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
                {membership?.status === "Active"
                  ? "Complete the form below to borrow this book."
                  : "As a non-member, you need to upload your ID card and payment proof to borrow this book."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); handleConfirmBorrow(); }} className="flex flex-col gap-3 mt-4">
              {/* Duration */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Borrowing Duration</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="duration" value="1w" checked={borrowDuration === "1w"} onChange={() => setBorrowDuration("1w")} />
                    <span>1 Week</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="duration" value="2w" checked={borrowDuration === "2w"} onChange={() => setBorrowDuration("2w")} />
                    <span>2 Weeks</span>
                  </label>
                </div>
              </div>
              {/* Non-member required fields */}
              {!(membership?.status === "Active") && (
                <>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">ID Card Image <span className="text-red-500">*</span></label>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setIdCardImage(e.target.files[0])}
                      className="border rounded px-2 py-1 bg-[#fffaf3] text-[#4a2c1a]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Payment Screenshot <span className="text-red-500">*</span></label>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setPaymentImage(e.target.files[0])}
                      className="border rounded px-2 py-1 bg-[#fffaf3] text-[#4a2c1a]"
                    />
                  </div>
                </>
              )}
              {/* Member optional payment image */}
              {membership?.status === "Active" && (
                <div className="flex flex-col">
                  <label className="text-sm font-medium">Payment Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPaymentImage(e.target.files[0])}
                    className="border rounded px-2 py-1 bg-[#fffaf3] text-[#4a2c1a]"
                  />
                </div>
              )}
              <div className="flex flex-col">
                <label className="text-sm font-medium">Note</label>
                <textarea
                  className="border rounded px-2 py-1 text-black"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional note"
                />
              </div>
              <DialogFooter className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpenDialog(false)}
                  className="px-4 py-2 bg-[#e6c9a9] text-[#4a2c1a] rounded-lg font-semibold hover:bg-[#fdf0e0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4a2c1a] text-white rounded-lg font-semibold hover:bg-[#5c4033]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Confirm"}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AllBooks;
