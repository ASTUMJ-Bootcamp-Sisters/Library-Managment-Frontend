import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookById, addComment, rateBook } from "../api/bookApi";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/Textarea";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0); // current user's rating

  // Replace with actual logged-in user ID from auth
  const currentUserId = "currentUserId";

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const data = await getBookById(id);
      setBook(data);

      // Set current user's rating if available
      const currentUserComment = data.comments?.find(c => c.user?._id === currentUserId);
      if (currentUserComment) setUserRating(currentUserComment.rating || 0);
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

  if (!book) return <p>Loading...</p>;

  const avgRating = Number(book.averageRating) || 0;

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Back button */}
      <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-6 h-6 text-[#4a2c1a]" />
        <span className="text-lg font-semibold text-[#4a2c1a]">Back</span>
      </div>

      {/* Book Info */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex justify-center">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-80 object-contain rounded-lg border border-gray-200"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-[#4a2c1a]">{book.title}</h1>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Category:</strong> {book.category?.name || "-"} ({book.category?.type || "-"})</p>
          <p><strong>Language:</strong> {book.language || "-"}</p>
          <p><strong>Publisher:</strong> {book.publisher || "-"}</p>
          <p><strong>Year:</strong> {book.year || "-"}</p>
          <p><strong>ISBN:</strong> {book.isbn || "-"}</p>
          <p><strong>Available:</strong> {book.available || 0}</p>
          <p><strong>Description:</strong> {book.description || "No description."}</p>

          {/* Average rating */}
          <p className="mt-1 font-semibold">
            Average Rating: {avgRating.toFixed(1)} ⭐ ({book.comments?.length || 0} reviews)
          </p>

          {/* Rate Book */}
          <div className="flex items-center gap-2 mt-2">
            <span>Your Rating:</span>
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                className={`text-2xl ${userRating >= star ? "text-yellow-500" : "text-gray-300"}`}
                onClick={() => handleRatingSubmit(star)}
              >
                ★
              </button>
            ))}
          </div>

          {/* Comments */}
          <div className="mt-4 f gap-2">
            <h2 className="text-xl font-semibold mb-2">Comments</h2>
            {book.comments?.length > 0 ? (
              book.comments.map((c) => (
                <div key={c._id} className="border-b py-2 flex gap-2 items-start">
                  <Avatar className="bg-slate-400">
                    {c.user?.profileImage ? (
                      <AvatarImage src={c.user.profileImage} alt={c.user?.fullName || "User"} />
                    ) : (
                      <AvatarFallback>
                        {c.user?.fullName
                          ? c.user.fullName
                               .split(" ")
                               .map ((n) => n[0])
                               .join("")
                              : "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{c.user?.fullName || "User"}</p>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <span
                          key={star}
                          className={star <= (c.rating || 0) ? "text-yellow-500" : "text-gray-300"}
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-2 text-sm text-gray-500">{c.rating || 0}</span>
                    </div>
                    <p>{c.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}

            {/* Add Comment */}
            <div className="mt-4 gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey){
                    e.preventDefault();
                    handleCommentSubmit();
                  }
                }}
                placeholder="Add comment"
                className=" flex-1 resize-none h-12 rounded"
              />
              <button
                onClick={handleCommentSubmit}
                className="bg-[#4a2c1a] text-white px-4 py-2 rounded hover:bg-[#633b25]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
