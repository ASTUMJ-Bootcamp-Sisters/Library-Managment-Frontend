import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../api/bookApi";
import BookCard from "../components/BookCard";
import { BookOpen } from "lucide-react";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

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
            onViewDetails={() => navigate(`/book/${book._id}`)} // ✅ Navigate to detail page
          />
        ))}
      </div>
    </div>
  );
};

export default AllBooks;
