import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBooks } from "../api/bookApi";

const phrases = [
  "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
  "اقْرَأْ",
];

const Welcome = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = React.useRef(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const data = await getAllBooks();
        setBooks(data);
      } catch (e) {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

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
      <section className="py-10 px-4 bg-[#fdf8f3] flex-1 relative">
        <h3 className="text-2xl font-bold text-[#5c4033] mb-6 text-center">Featured Books</h3>
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
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#e6d5c3] scrollbar-track-[#fdf8f3]"
              style={{ scrollBehavior: 'smooth' }}
            >
              {books.map((book) => (
                <div
                  key={book._id}
                  className="min-w-[220px] max-w-[240px] bg-white rounded-lg shadow-md p-4 flex flex-col items-center border border-[#e6d5c3] hover:shadow-lg transition-shadow duration-200"
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
                    className="w-32 h-40 object-cover rounded mb-3 border bg-gray-100"
                    onError={e => { e.target.src = "/public/loginpic.jpeg"; }}
                  />
                  <h4 className="text-lg font-semibold text-[#5c4033] mb-1 text-center truncate w-full" title={book.title}>
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
