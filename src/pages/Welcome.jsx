import { BookOpen, Calendar, MapPin, User, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBooks } from "../api/bookApi";

import useBookReviewStore from "../store/bookReviewStore";
const phrases = [
  "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
  "اقْرَأْ",
];

const Welcome = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = React.useRef(null);
  // Book reviews state from store
  const { reviews, fetchReviews, loading: reviewLoading } = useBookReviewStore();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await getAllBooks();
        const booksArray = Array.isArray(response) ? response : response?.data || [];
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

  // Scroll handlers for arrows
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
      <div className="flex flex-col min-h-screen bg-[#fdf8f3]">
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center  overflow-hidden">
        <img
          src="/well.png"
          alt="Islamic Book"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-80 scale-110"
        />
        <div className="absolute inset-0 " />
        <div className="relative z-10 text-center text-white flex flex-col items-center px-4">
          {phrases.map((text, idx) => (
            <h1 key={idx} className="text-5xl md:text-7xl font-extrabold mb-2 drop-shadow-lg tracking-wide">
              {text}
            </h1>
          ))}
          <h2 className="text-2xl md:text-3xl font-semibold mt-6 mb-2 drop-shadow-lg tracking-wide">Welcome to ASTUMSJ Library</h2>
          <p className="max-w-2xl mt-4 text-lg md:text-xl text-[#ffffff] font-medium drop-shadow-lg">
            Discover, borrow, and enjoy a world of knowledge. Explore our featured books below!
          </p>
        </div>
      </section>

      {/* Login to Explore Button */}
      <div className="flex justify-center mt-[-2.5rem] mb-8 z-20 relative">
        <Link to="/login">
          <button className="bg-gradient-to-r from-[#5c4033] to-[#7b5e57] hover:from-[#7b5e57] hover:to-[#5c4033] text-white font-bold px-10 py-4 rounded-full shadow-2xl text-xl tracking-wide transition-all duration-200 border-4 border-[#e6d5c3]">
            Login to <span className="underline decoration-[#e6d5c3]">Explore</span>
          </button>
        </Link>
      </div>

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
          <div className="relative">
            {/* Left Arrow */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#5c4033] text-white rounded-full p-2 shadow-md hover:bg-[#7b5e57] transition hidden md:block"
              onClick={scrollLeft}
              aria-label="Scroll left"
              style={{ opacity: books.length > 3 ? 1 : 0, pointerEvents: books.length > 3 ? 'auto' : 'none' }}
            >
              &#8592;
            </button>
            {/* Book Cards */}
              <div
                ref={scrollRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#e6d5c3] scrollbar-track-[#fdf8f3]"
                style={{ scrollBehavior: 'smooth' }}
              >
                {books.map((book) => (
                  <div
                    key={book._id}
                    className="min-w-[180px] sm:min-w-[220px] max-w-[240px] bg-white rounded-lg shadow-md p-3 sm:p-4 flex flex-col items-center border border-[#e6d5c3] hover:shadow-lg transition-shadow duration-200"
                  >
                    <img
                      src={
                        book.image && typeof book.image === "string"
                          ? book.image
                          : book.coverImage && typeof book.coverImage === "string"
                            ? book.coverImage
                            : "/public/loginpic.jpeg"
                      }
                      alt={book.title}
                      className="w-24 h-32 sm:w-32 sm:h-40 object-cover rounded mb-3 border bg-gray-100"
                      onError={e => { e.target.src = "/public/loginpic.jpeg"; }}
                    />
                    <h4 className="text-base sm:text-lg font-semibold text-[#5c4033] mb-1 text-center truncate w-full" title={book.title}>
                    {book.title}
                  </h4>
                  <p className="text-sm text-gray-700 mb-2 text-center line-clamp-2">
                    {typeof book.author === "string"
                      ? book.author
                      : book.author && book.author.name
                        ? book.author.name
                        : "Unknown Author"}
                  </p>
                  <span className="text-xs text-gray-500">
                    {typeof book.category === "string"
                      ? book.category
                      : book.category && book.category.name
                        ? book.category.name
                        : "Unknown Category"}
                  </span>
                </div>
              ))}
            </div>
            {/* Right Arrow */}
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#5c4033] text-white rounded-full p-2 shadow-md hover:bg-[#7b5e57] transition hidden md:block"
              onClick={scrollRight}
              aria-label="Scroll right"
              style={{ opacity: books.length > 3 ? 1 : 0, pointerEvents: books.length > 3 ? 'auto' : 'none' }}
            >
              &#8594;
            </button>
          </div>
        )}
      </section>

      {/* Book Review Events */}
     {/* Quote Section under Hero */}
<div className="bg-[#5c4033] text-white py-8 px-4 text-center shadow-lg">
  <p className="text-xl italic max-w-3xl mx-auto">
    "The ink of the scholar is more sacred than the blood of the martyr."
  </p>
</div>

{/* Stats Section */}
<section className="py-10 bg-[#fdf8f3] grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
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

{/* Aesthetic Book Review Events */}
<section className="py-14 px-6 bg-gradient-to-b from-[#fdf8f3] to-[#f5ece6] relative">
  <h3 className="text-3xl font-extrabold text-[#5c4033] mb-10 text-center tracking-wide">
    🌟 Upcoming Book Review Events 🌟
  </h3>
  {reviewLoading ? (
    <div className="text-center text-gray-500">Loading events...</div>
  ) : reviews.length === 0 ? (
    <div className="text-center text-gray-500">No book review events found.</div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {reviews.map((review) => (
      <div
  key={review._id}
  className="bg-white rounded-2xl shadow-md border border-[#e6d5c3] p-5 hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col items-center text-center min-h-[360px] max-w-[320px] mx-auto"
>
  {/* Event Image */}
  <img
    src={review.image || "/public/loginpic.jpeg"}
    alt={review.bookTitle}
    className="w-28 h-28 object-cover rounded-full mb-4 border-2 border-[#e6d5c3] shadow-sm"
    onError={(e) => { e.target.src = "/public/loginpic.jpeg"; }}
  />

  {/* Book Title */}
  <h4 className="text-xl font-semibold text-[#5c4033] mb-3">
    {review.bookTitle}
  </h4>

  {/* Event Info with Labels + Icons */}
  <div className="space-y-2 text-gray-700 text-sm w-full text-left">
    <div className="flex items-center gap-2">
      <BookOpen className="w-4 h-4 text-[#5c4033]" />
      <span><strong>Book:</strong> {review.bookTitle}</span>
    </div>
    <div className="flex items-center gap-2">
      <User className="w-4 h-4 text-[#5c4033]" />
      <span><strong>Author:</strong> {review.author}</span>
    </div>
    <div className="flex items-center gap-2">
      <MapPin className="w-4 h-4 text-[#5c4033]" />
      <span>{review.location}</span>
    </div>
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-[#5c4033]" />
      <span>
        {new Date(review.dateTime).toLocaleDateString()} -{" "}
        {new Date(review.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4 text-[#5c4033]" />
      <span>{review.gender}</span>
    </div>
  </div>

  {/* Invite Message */}
  <p className="text-sm italic text-[#7b5e57] mt-3">
    🌸 Everyone is invited 🌸
  </p>

  {/* CTA Button */}
  {/* <button className="mt-4 bg-gradient-to-r from-[#5c4033] to-[#7b5e57] text-white px-5 py-2 rounded-full text-sm shadow hover:scale-105 transition">
    Join
  </button> */}
</div>

      ))}
    </div>
  )}
</section>


      {/* Footer */}
      <footer className="bg-[#5c4033] text-white py-4 text-center mt-auto">
        <div className="container mx-auto">
          <p className="text-sm">&copy; {new Date().getFullYear()} ASTUMSJ Library. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
