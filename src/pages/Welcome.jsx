// src/components/Welcome.js

import { BookOpen, Calendar, MapPin, User, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBooks } from "../api/bookApi";
import useBookReviewStore from "../store/bookReviewStore";
import PublicNavbar from "../components/PublicNavbar";

const phrases = ["بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", "اقْرَأْ"];

const Welcome = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = React.useRef(null);
  const { reviews, fetchReviews, loading: reviewLoading } = useBookReviewStore();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await getAllBooks();
        const booksArray = Array.isArray(response) ? response : response?.data ?? [];
        setBooks(booksArray);
      } catch {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
    fetchReviews();
  }, [fetchReviews]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fdf8f3]">
      < PublicNavbar/>

      {/* Hero Section */}
      <section
        className="relative h-[80vh] md:h-[90vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/bookshelf.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white flex flex-col items-center px-4">
          {phrases.map((text, idx) => (
            <h1
              key={idx}
              className="text-5xl md:text-7xl font-extrabold mb-2 drop-shadow-lg tracking-wide"
            >
              {text}
            </h1>
          ))}
          <h2 className="text-2xl md:text-3xl font-semibold mt-6 mb-2 drop-shadow-lg tracking-wide">
            Welcome to ASTUMSJ Library
          </h2>
          <p className="max-w-2xl mt-4 text-lg md:text-xl text-gray-100 font-medium drop-shadow-lg">
            Discover, borrow, and enjoy a world of knowledge. Explore our events and featured books below!
          </p>
        </div>
      </section>

      {/* Book Review Events */}
      <section className="py-14 px-6 bg-gradient-to-b from-[#fdf8f3] to-[#f5ece6]">
        <h3 className="text-3xl md:text-4xl font-extrabold text-[#5c4033] mb-10 text-center tracking-wide drop-shadow-sm">
          🌟 Upcoming Book Review Events 🌟
        </h3>
        {reviewLoading ? (
          <div className="text-center text-gray-500">Loading events...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-500">No book review events found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-xl shadow-lg border border-[#e6d5c3] p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl group"
              >
                <div className="relative w-full h-24 mb-16">
                  <img
                    src={review.image || "/public/loginpic.jpeg"}
                    alt={review.bookTitle}
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl group-hover:border-[#e6d5c3] transition-colors"
                    onError={(e) => {
                      e.target.src = "/public/loginpic.jpeg";
                    }}
                  />
                </div>
                <h4 className="text-2xl font-bold text-[#5c4033] mb-4">{review.bookTitle}</h4>
                <div className="space-y-3 text-gray-600 text-sm w-full text-left">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[#7b5e57] flex-shrink-0" />
                    <span>
                      <strong>Author:</strong> {review.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#7b5e57] flex-shrink-0" />
                    <span>{review.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#7b5e57] flex-shrink-0" />
                    <span>
                      {new Date(review.dateTime).toLocaleDateString()} -{" "}
                      {new Date(review.dateTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#7b5e57] flex-shrink-0" />
                    <span>{review.gender}</span>
                  </div>
                </div>
                <p className="text-md font-semibold text-[#5c4033] mt-6 bg-[#fdf0e0] px-4 py-2 rounded-full">
                  🌸 Everyone is invited 🌸
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Books */}
      <section className="py-10 px-2 sm:px-4 bg-[#fdf8f3] flex-1 relative">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 justify-center">
            <BookOpen className="w-10 h-10 text-[#4a2c1a] drop-shadow-lg" />
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#4a2c1a] tracking-wide font-serif drop-shadow-lg">
              Featured Books
            </h3>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-[#e6d5c3] via-[#fdf0e0] to-[#e6c9a9] rounded-full mt-2" />
        </div>
        {loading ? (
          <div className="text-center text-gray-500">Loading books...</div>
        ) : books.length === 0 ? (
          <div className="text-center text-gray-500">No featured books found.</div>
        ) : (
          <div className="relative max-w-7xl mx-auto">
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#5c4033] text-white rounded-full p-2 shadow-md hover:bg-[#7b5e57] transition hidden md:block"
              onClick={scrollLeft}
              aria-label="Scroll left"
              style={{
                opacity: books.length > 4 ? 1 : 0.3,
                pointerEvents: books.length > 4 ? "auto" : "none",
              }}
            >
              &larr;
            </button>
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#e6d5c3] scrollbar-track-transparent"
              style={{ scrollBehavior: "smooth" }}
            >
              {books.map((book) => (
                <div
                  key={book._id}
                  className="group min-w-[240px] max-w-[240px] bg-white rounded-lg shadow-md p-4 flex flex-col items-center border-t-4 border-transparent hover:border-[#7b5e57] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <img
                    src={book.image || book.coverImage || "/public/loginpic.jpeg"}
                    alt={book.title}
                    className="w-32 h-48 object-cover rounded-md mb-4 shadow-lg group-hover:shadow-xl transition-shadow"
                    onError={(e) => {
                      e.target.src = "/public/loginpic.jpeg";
                    }}
                  />
                  <h4
                    className="text-lg font-bold text-[#5c4033] mb-1 text-center truncate w-full"
                    title={book.title}
                  >
                    {book.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2 text-center">
                    {book.author?.name || book.author || "Unknown Author"}
                  </p>
                  <span className="text-xs text-white bg-gradient-to-r from-[#9a7d6a] to-[#7b5e57] px-3 py-1 rounded-full">
                    {book.category?.name || book.category || "General"}
                  </span>
                </div>
              ))}
            </div>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#5c4033] text-white rounded-full p-2 shadow-md hover:bg-[#7b5e57] transition hidden md:block"
              onClick={scrollRight}
              aria-label="Scroll right"
              style={{
                opacity: books.length > 4 ? 1 : 0.3,
                pointerEvents: books.length > 4 ? "auto" : "none",
              }}
            >
              &rarr;
            </button>
          </div>
        )}
      </section>

      {/* Quote Section */}
      <div className="bg-[#5c4033] text-white py-8 px-4 text-center shadow-lg">
        <p className="text-xl italic max-w-3xl mx-auto">
          "The ink of the scholar is more sacred than the blood of the martyr."
        </p>
      </div>

      {/* Stats Section */}
      <section className="py-10 bg-[#fdf8f3] grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#e6d5c3] hover:shadow-xl transition">
          <h3 className="text-3xl font-extrabold text-[#5c4033]">7+</h3>
          <p className="text-gray-600 mt-2">Books Available</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#e6d5c3] hover:shadow-xl transition">
          <h3 className="text-3xl font-extrabold text-[#5c4033]">2+</h3>
          <p className="text-gray-600 mt-2">Book Reviews Hosted</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#e6d5c3] hover:shadow-xl transition">
          <h3 className="text-3xl font-extrabold text-[#5c4033]">18+</h3>
          <p className="text-gray-600 mt-2">Active Members</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4a2c1a] text-white py-4 text-center mt-auto">
        <div className="container mx-auto">
          <p className="text-sm">&copy; {new Date().getFullYear()} ASTUMSJ Library. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
