import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { Clock, Star } from "lucide-react";
import { getRecentBooks, getRecomendedBooks } from "@/api/bookApi";

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
    <div className="min-h-screen bg-[#faf6f1] p-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-[#e5d6c5] mb-6">
        <h1 className="text-3xl font-bold text-[#5c4033]">
          Welcome back, {user?.fullName || "Student"} 👋
        </h1>
        <p className="text-[#7b5e57] mt-2">
          Explore new books, check your recent activity, and get personalized
          recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Borrowed */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-[#e5d6c5]">
          <h2 className="text-xl font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#c68c53]" /> Recently Borrowed
          </h2>
          <div className="space-y-4">
            {recentBooks.length > 0 ? (
              recentBooks.slice(0, visibleRecent).map((book) => (
                <div
                  key={book._id}
                  onClick={() => navigate(`/book/${book._id}`)}
                  className="flex items-center gap-4 p-3 bg-[#fdf8f3] rounded-lg shadow-sm cursor-pointer hover:bg-[#f5efe9] transition"
                >
                  <img
                    src={imageUrl(book)}
                    alt={book.title}
                    className="w-14 h-20 object-cover rounded-md border"
                  />
                  <div>
                    <h3 className="font-medium text-[#5c4033]">{book.title}</h3>
                    <p className="text-sm text-[#7b5e57]">by {book.author}</p>
                    <p className="text-xs text-[#a1887f]">Borrowed recently</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#7b5e57]">No recent borrowings.</p>
            )}
          </div>
          {visibleRecent < recentBooks.length ? (
            <button
              className="mt-4 px-4 py-2 bg-amber-900 text-white rounded-lg"
              onClick={() => setVisibleRecent(visibleRecent + 5)}
            >
              Show More
            </button>
          ) : visibleRecent > 5 ? (
            <button
              className="mt-4 px-4 py-2 bg-amber-900 text-white rounded-lg"
              onClick={() => setVisibleRecent(5)}
            >
              Show Less
            </button>
          ) : null}
        </div>

        {/* Recommended */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-[#e5d6c5]">
          <h2 className="text-xl font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" /> Recommended for You
          </h2>
          <div className="space-y-4">
            {recommendedBooks.length > 0 ? (
              recommendedBooks
                .slice(0, visibleRecommended)
                .map((book) => (
                  <div
                    key={book._id}
                    onClick={() => navigate(`/book/${book._id}`)}
                    className="flex items-center gap-4 p-3 bg-[#fdf8f3] rounded-lg shadow-sm cursor-pointer hover:bg-[#f5efe9] transition"
                  >
                    <img
                      src={imageUrl(book)}
                      alt={book.title}
                      className="w-14 h-20 object-cover rounded-md border"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-[#5c4033]">{book.title}</h3>
                      <p className="text-sm text-[#7b5e57]">by {book.author}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-[#5c4033]">
                        {book.averageRating || "N/A"}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-[#7b5e57]">No recommendations available.</p>
            )}
          </div>
          {visibleRecommended < recommendedBooks.length ? (
            <button
              className="mt-4 px-4 py-2 bg-amber-900 text-white rounded-lg"
              onClick={() => setVisibleRecommended(visibleRecommended + 5)}
            >
              Show More
            </button>
          ) : visibleRecommended > 5 ? (
            <button
              className="mt-4 px-4 py-2 bg-amber-900 text-white rounded-lg"
              onClick={() => setVisibleRecommended(5)}
            >
              Show Less
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
