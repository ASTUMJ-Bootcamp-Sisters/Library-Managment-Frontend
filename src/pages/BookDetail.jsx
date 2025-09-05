import { ArrowLeft, Send, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addComment, getBookById, rateBook } from "../api/bookApi";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/Textarea";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({ comments: [], averageRating: 0 });
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [openMenu, setOpenMenu] = useState(null); // track which comment's menu is open

  // ✅ Get current user ID from localStorage (saved during login)
  const currentUserId = localStorage.getItem("userId")?.toString();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await getBookById(id);
      const bookData = response?.data || response;

      setBook({
        ...bookData,
        averageRating: Number(bookData.averageRating) || 0,
        comments: bookData.comments || [],
      });

      // Set user rating if current user already rated
      const currentUserComment = bookData.comments?.find(
        (c) =>
          c.user?._id?.toString() === currentUserId ||
          c.user?.id?.toString() === currentUserId
      );
      if (currentUserComment) setUserRating(currentUserComment.rating || 0);
      console.log("Current user ID:", currentUserId);
      console.log("Book comments users:", book.comments.map(c => c.user?._id || c.user?.id));

    } catch (err) {
      console.error("Error fetching book:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment(id, { text: newComment, rating: userRating });
      setNewComment("");
      fetchBook();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleRatingSubmit = async (value) => {
    setUserRating(value);
    try {
      await rateBook(id, { value });
      fetchBook();
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  const handleCommentMenu = (commentId) => {
    setOpenMenu(openMenu === commentId ? null : commentId);
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-[#fffaf3] p-6">
      {/* Back Button */}
      <div
        className="flex items-center gap-2 mb-6 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-6 h-6 text-[#4a2c1a]" />
        <span className="text-lg font-semibold text-[#4a2c1a]">Back</span>
      </div>

      {/* Book Container */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row gap-6">
        {/* Book Image */}
        <div className="md:w-1/3 flex justify-center items-start">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-auto max-h-[500px] object-contain rounded-lg border border-gray-200 shadow-md"
          />
        </div>

        {/* Book Details */}
        <div className="md:w-2/3 flex flex-col gap-3">
          <h1 className="text-4xl font-extrabold text-[#4a2c1a]">{book.title}</h1>
          <p className="text-lg text-gray-700"><strong>Author:</strong> {book.author}</p>
          <p className="text-lg text-gray-700">
            <strong>Category:</strong> {book.category?.name || "N/A"} ({book.category?.type || "N/A"})
          </p>
          <p className="text-lg text-gray-700"><strong>Language:</strong> {book.language || "N/A"}</p>
          <p className="text-lg text-gray-700"><strong>Publisher:</strong> {book.publisher || "N/A"}</p>
          <p className="text-lg text-gray-700"><strong>Year:</strong> {book.year || "N/A"}</p>
          <p className="text-lg text-gray-700"><strong>ISBN:</strong> {book.isbn || "N/A"}</p>
          <p className="text-lg text-gray-700"><strong>Available:</strong> {book.available || 0}</p>
          <p className="text-lg text-gray-700"><strong>Description:</strong> {book.description || "N/A"}</p>

          <p className="mt-2 font-semibold text-yellow-600">
            ⭐ Average Rating: {book.averageRating.toFixed(1)} ({book.comments.length} reviews)
          </p>
        </div>
      </div>

      {/* Rating Section */}
      <div className="max-w-6xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-[#4a2c1a] mb-4">Your Rating</h2>
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`text-3xl ${userRating >= star ? "text-yellow-500" : "text-gray-300"}`}
              onClick={() => handleRatingSubmit(star)}
            >
              ★
            </button>
          ))}
        </div>

        {/* Comments Section */}
        <h2 className="text-2xl font-bold text-[#4a2c1a] mb-4">Comments</h2>
        {book.comments.length > 0 ? (
          book.comments.map((c) => (
            <div key={c._id} className="border-b py-3 flex gap-3 items-start relative">
              <Avatar className="bg-slate-400">
                {c.user?.profileImage ? (
                  <AvatarImage src={c.user.profileImage} alt={c.user?.fullName || "User"} />
                ) : (
                  <AvatarFallback>
                    {c.user?.fullName ? c.user.fullName.split(" ").map(n => n[0]).join("") : "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{c.user?.fullName || "User"}</p>
                <p className="text-gray-700">{c.text}</p>
              </div>

              {/* 3-dot menu (only for current user) */}
              {(c.user?._id?.toString() === currentUserId || c.user?.id?.toString() === currentUserId) && (
                <div className="relative">
                  <button
                    className="absolute top-2 right-2 p-1 text-gray-600 hover:text-gray-900"
                    onClick={() => handleCommentMenu(c._id)}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {openMenu === c._id && (
                    <div className="absolute top-8 right-2 bg-white border shadow-md rounded w-32">
                      <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                        Edit
                      </button>
                      <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-100">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}

        {/* Add Comment */}
        <div className="mt-6 flex gap-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCommentSubmit();
              }
            }}
            placeholder="Add a comment..."
            className="flex-1 resize-none h-16 rounded border border-gray-300"
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-[#4a2c1a] text-white px-5 py-3 rounded hover:bg-[#633b25] flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
