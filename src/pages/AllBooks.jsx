import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../api/bookApi";
import { borrowBook } from "../api/borrowApi";
import BookCard from "../components/BookCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/button";
import { toast } from "../hooks/use-toast";
import useMembershipStore from "../store/membershipStore";

const AllBooks = () => {
  const { membership, getMembershipStatus } = useMembershipStore();
  const navigate = useNavigate();

  useEffect(() => {
    getMembershipStatus();
  }, [getMembershipStatus]);

  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  // same states from BookDetail
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [borrowDuration, setBorrowDuration] = useState("1w");
  const [idCardImage, setIdCardImage] = useState(null);
  const [paymentImage, setPaymentImage] = useState(null);
  const [borrowNote, setBorrowNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBorrowDialogOpen = (book) => {
    if (book.available <= 0) {
      toast({
        title: "Book unavailable",
        description: "This book is currently out of stock",
        variant: "destructive",
      });
      return;
    }
    setSelectedBook(book);
    setBorrowDialogOpen(true);
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) setter(file);
  };

  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook) return;

    const isMember = membership?.status === "Active";
    if (!isMember) {
      if (!idCardImage || !paymentImage) {
        toast({
          title: "Missing files",
          description: "Upload ID card and payment proof",
          variant: "destructive",
        });
        return;
      }
    }
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("bookId", selectedBook._id);
      formData.append("duration", borrowDuration);
      if (borrowNote) formData.append("note", borrowNote);
      if (!isMember) {
        formData.append("idCardImage", idCardImage);
        formData.append("paymentImage", paymentImage);
      }
      await borrowBook(formData);
      setBorrowDialogOpen(false);
      setBorrowDuration("1w");
      setBorrowNote("");
      setIdCardImage(null);
      setPaymentImage(null);
      toast({ title: "Success", description: "Borrow request submitted" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to borrow book", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-[#fffaf3] via-[#fdf0e0] to-[#e6c9a9] py-4 shadow-md flex items-center justify-center gap-3 h-[80px]">
        <BookOpen className="w-8 h-8 text-[#4a2c1a]" />
        <h1 className="text-3xl font-extrabold text-[#4a2c1a]">All Books</h1>
      </div>

      {/* Books grid: 5 per row on lg screens */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6">
          {books.length > 0 ? (
            books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                small
                onBorrowClick={() => handleBorrowDialogOpen(book)}
                onViewDetails={() => navigate(`/book/${book._id}`)}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">No books found.</div>
          )}
        </div>
      </div>

      {/* Borrow Dialog */}
      {selectedBook && (
        <Dialog open={borrowDialogOpen} onOpenChange={setBorrowDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Borrow Book</DialogTitle>
              <DialogDescription>
                {membership?.status === "Active"
                  ? `Borrow "${selectedBook.title}"`
                  : `As a non-member, upload ID card and payment proof to borrow "${selectedBook.title}"`}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleBorrowSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Borrowing Duration</Label>
                <RadioGroup value={borrowDuration} onValueChange={setBorrowDuration} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1w" id="1w" /><Label htmlFor="1w">1 Week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2w" id="2w" /><Label htmlFor="2w">2 Weeks</Label>
                  </div>
                </RadioGroup>
              </div>
              {membership?.status !== "Active" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="idCard">ID Card Image</Label>
                    <input type="file" id="idCard" accept="image/*"
                      onChange={(e) => handleFileChange(e, setIdCardImage)} className="w-full border rounded p-2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment">Payment Screenshot</Label>
                    <input type="file" id="payment" accept="image/*"
                      onChange={(e) => handleFileChange(e, setPaymentImage)} className="w-full border rounded p-2" />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="note">Notes (Optional)</Label>
                <Textarea id="note" value={borrowNote} onChange={(e) => setBorrowNote(e.target.value)} className="w-full" />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setBorrowDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#653b21] hover:bg-[#965a39] text-white" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Borrow"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AllBooks;
