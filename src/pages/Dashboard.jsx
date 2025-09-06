import { getRecentBooks, getRecomendedBooks } from "@/api/bookApi";
import useAuthStore from "@/store/authStore";
import { ChevronDown, ChevronUp, Clock, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  const [recentBooks, setRecentBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [visibleRecent, setVisibleRecent] = useState(5);
  const [visibleRecommended, setVisibleRecommended] = useState(5);

  useEffect(() => {
    if (isAdmin && isAdmin()) {
      navigate("/AdminDashboard");
    }

    const fetchBooks = async () => {
      try {
        const recentRes = await getRecentBooks();
        const recommendedRes = await getRecomendedBooks();

        const recentArray = Array.isArray(recentRes.data)
          ? recentRes.data
          : recentRes.data
          ? [recentRes.data]
          : [];
        const recommendedArray = Array.isArray(recommendedRes.data)
          ? recommendedRes.data
          : recommendedRes.data
          ? [recommendedRes.data]
          : [];

        setRecentBooks(recentArray.slice(0, 15));
        setRecommendedBooks(recommendedArray.slice(0, 15));
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();
  }, [isAdmin, navigate]);

  const imageUrl = (book) => book.image || "/placeholder.jpg";

  return (
    <div className="min-h-screen w-full flex flex-col justify-start items-center p-6 bg-gradient-to-b from-[#f3e7dd] via-[#e4d0bf] to-[#e9d1c0]">
      <div className="relative w-full">
        {/* Welcome Card */}
        <div className="bg-[#f7f2ec] rounded-2xl shadow-xl p-6 border border-[#e3c1ab] mb-6 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[#4b2e2b]">
            Welcome back, {user?.fullName || "Student"} 👋
          </h1>
          <p className="text-[#6d4c41] mt-2">
            Explore new books, check your recent activity, and get personalized
            recommendations.
          </p>
        </div>

        {/* Bookshelf Rows */}
        <div
          className="flex flex-col gap-10 items-center justify-center w-full pt-2"
          style={{ minHeight: "400px" }}
        >
          {/* Recommended Books */}
          <div className="flex flex-col items-center w-full">
            <h2 className="text-xl font-semibold text-[#4b2e2b] mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" /> Recommended for You
            </h2>
            <div className="relative w-full flex flex-row gap-6 justify-center items-end pb-10">
              {/* Wooden Shelf */}
              <div className="absolute left-0 right-0 bottom-0 h-10 bg-gradient-to-r from-[#8d6e63] to-[#6d4c41] rounded-b-2xl shadow-lg border-b-4 border-[#4e342e] z-0" />
              {/* Books */}
              <div className="relative flex flex-row gap-6 justify-center items-end w-full z-10">
                {recommendedBooks.length > 0 ? (
                  recommendedBooks
                    .slice(0, visibleRecommended)
                    .map((book) => (
                      <div
                        key={book._id}
                        onClick={() => navigate(`/book/${book._id}`)}
                        className="flex flex-col items-center cursor-pointer"
                        style={{ minWidth: "90px", maxWidth: "120px" }}
                      >
                        <img
                          src={imageUrl(book)}
                          alt={book.title}
                          className="w-20 h-28 object-cover rounded-md border border-[#5d4037] shadow-md hover:scale-105 transition-transform"
                        />
                        <h3 className="font-medium text-[#4b2e2b] text-center mt-2 text-sm truncate w-full">
                          {book.title}
                        </h3>
                        <p className="text-xs text-[#6d4c41] text-center">
                          {book.author}
                        </p>
                      </div>
                    ))
                ) : (
                  <p className="text-[#6d4c41]">No recommendations available.</p>
                )}

                {/* Arrow Button */}
                {recommendedBooks.length > 5 && (
                  <div className="flex flex-col justify-end">
                    {visibleRecommended < recommendedBooks.length ? (
                      <button
                        className="p-2 bg-[#4e342e] text-white rounded-full shadow-lg hover:bg-[#3e2723] transition"
                        onClick={() =>
                          setVisibleRecommended(visibleRecommended + 5)
                        }
                      >
                        <ChevronDown className="w-5 h-5" />
                      </button>
                    ) : visibleRecommended > 5 ? (
                      <button
                        className="p-2 bg-[#4e342e] text-white rounded-full shadow-lg hover:bg-[#3e2723] transition"
                        onClick={() => setVisibleRecommended(5)}
                      >
                        <ChevronUp className="w-5 h-5" />
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recently Borrowed Books */}
          <div className="flex flex-col items-center w-full">
            <h2 className="text-xl font-semibold text-[#4b2e2b] mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#a1887f]" /> Recently Borrowed
            </h2>
            <div className="relative w-full flex flex-row gap-6 justify-center items-end pb-10">
              {/* Wooden Shelf */}
              <div className="absolute left-0 right-0 bottom-0 h-10 bg-gradient-to-r from-[#8d6e63] to-[#6d4c41] rounded-b-2xl shadow-lg border-b-4 border-[#4e342e] z-0" />
              {/* Books */}
              <div className="relative flex flex-row gap-6 justify-center items-end w-full z-10">
                {recentBooks.length > 0 ? (
                  recentBooks.slice(0, visibleRecent).map((book) => (
                    <div
                      key={book._id}
                      onClick={() => navigate(`/book/${book._id}`)}
                      className="flex flex-col items-center cursor-pointer"
                      style={{ minWidth: "90px", maxWidth: "120px" }}
                    >
                      <img
                        src={imageUrl(book)}
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded-md border border-[#5d4037] shadow-md hover:scale-105 transition-transform"
                      />
                      <h3 className="font-medium text-[#4b2e2b] text-center mt-2 text-sm truncate w-full">
                        {book.title}
                      </h3>
                      <p className="text-xs text-[#6d4c41] text-center">
                        {book.author}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#6d4c41]">No recent borrowings.</p>
                )}

                {/* Arrow Button */}
                {recentBooks.length > 5 && (
                  <div className="flex flex-col justify-end">
                    {visibleRecent < recentBooks.length ? (
                      <button
                        className="p-2 bg-[#4e342e] text-white rounded-full shadow-lg hover:bg-[#3e2723] transition"
                        onClick={() => setVisibleRecent(visibleRecent + 5)}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </button>
                    ) : visibleRecent > 5 ? (
                      <button
                        className="p-2 bg-[#4e342e] text-white rounded-full shadow-lg hover:bg-[#3e2723] transition"
                        onClick={() => setVisibleRecent(5)}
                      >
                        <ChevronUp className="w-5 h-5" />
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
