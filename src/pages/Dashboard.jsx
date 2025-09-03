import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { BookOpen, Star, Clock } from "lucide-react";

const Dashboard = ({ books = [] }) => {
  const { user, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin && isAdmin()) {
      navigate("/AdminDashboard");
    }
  }, [isAdmin, navigate]);

  // Recently borrowed - last 3 books
  const recentBooks = useMemo(() => books.slice(0, 3), [books]);

  // Recommended by rating
  const recommendedBooks = useMemo(() => {
    return [...books]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
  }, [books]);

  return (
    <div className="min-h-screen bg-[#faf6f1] p-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-[#e5d6c5] mb-6">
        <h1 className="text-3xl font-bold text-[#5c4033]">
          Welcome back, {user?.fullName || "Student"} 👋
        </h1>
        <p className="text-[#7b5e57] mt-2">
          Explore new books, check your recent activity, and get personalized recommendations.
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
              recentBooks.map((book) => (
                <div
                  key={book._id}
                  className="flex items-center gap-4 p-3 bg-[#fdf8f3] rounded-lg shadow-sm"
                >
                  <img
                    src={book.coverImage || "/placeholder.jpg"}
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
        </div>

        {/* Recommended */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-[#e5d6c5]">
          <h2 className="text-xl font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" /> Recommended for You
          </h2>
          <div className="space-y-4">
            {recommendedBooks.length > 0 ? (
              recommendedBooks.map((book) => (
                <div
                  key={book._id}
                  className="flex items-center gap-4 p-3 bg-[#fdf8f3] rounded-lg shadow-sm"
                >
                  <img
                    src={book.coverImage || "/placeholder.jpg"}
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
                      {book.rating ? book.rating.toFixed(1) : "N/A"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#7b5e57]">No recommendations available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
