import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../api/bookApi";
import BookCard from "../components/BookCard";
import { BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose, DialogTrigger } from "@/components/ui/dialog";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getAllBooks();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const handleBorrow =(book) =>{
    setSelectedBook(book);
    setOpenDialog(true);
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
        {books.map((book) => (
          <BookCard
            key={book._id}
            book={book}
            onBorrowClick={handleBorrow}
            onViewDetails={() => navigate(`/book/${book._id}`)} // ✅ Navigate to detail page
          />
        ))}
      </div>
      
      {/* Borrow Dilog*/}
      {selectedBook && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="bg-white">
            <DialogHeader >
              <DialogTitle>Borrow Book</DialogTitle>
              <DialogDescription>
                Do you want to borrow <b>{selectedBook.title}</b>?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <button
                onClick={() => setOpenDialog (false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button onClick={() =>{
                console.log("Borrow confrimed:", selectedBook);
                setOpenDialog(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg">
                Confrim
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AllBooks;
