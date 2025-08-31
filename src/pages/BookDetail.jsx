import { ArrowLeft } from "lucide-react";
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

  const currentUserId = "currentUserId";

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const data = await getBookById(id);
      setBook({
        ...data,
        averageRating: Number(data.averageRating) || 0,
        comments: data.comments || [],
      });

      const currentUserComment = data.comments?.find(
        (c) => c.user?._id === currentUserId
      );
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

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-6 h-6 text-[#4a2c1a]" />
        <span className="text-lg font-semibold text-[#4a2c1a]">Back</span>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex justify-center">
          <img src={book.image} alt={book.title} className="w-full h-80 object-contain rounded-lg border border-gray-200" />
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-[#4a2c1a]">{book.title}</h1>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Category:</strong> {book.category?.name || "N/A"} ({book.category?.type || "N/A"})</p>
          <p><strong>Language:</strong> {book.language || "N/A"}</p>
          <p><strong>Publisher:</strong> {book.publisher || "N/A"}</p>
          <p><strong>Year:</strong> {book.year || "N/A"}</p>
          <p><strong>ISBN:</strong> {book.isbn || "N/A"}</p>
          <p><strong>Available:</strong> {book.available || 0}</p>
          <p><strong>Description:</strong> {book.description || "N/A"}</p>

          <p className="mt-1 font-semibold">
            Average Rating: {book.averageRating.toFixed(1)} ⭐ ({book.comments.length} reviews)
          </p>

          <div className="flex items-center gap-2 mt-2">
            <span>Your Rating:</span>
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                className={`text-2xl ${userRating >= star ? "text-yellow-500" : "text-gray-300"}`}
                onClick={() => handleRatingSubmit(star)}
              >★</button>
            ))}
          </div>

          {/* Comments Section */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Comments</h2>
            {book.comments.length > 0 ? (
              book.comments.map((c) => (
                <div key={c._id} className="border-b py-2 flex gap-2 items-start">
                  <div className="flex-1">
                    <p className="font-semibold">{c.user?.name || "User"}</p>
                    <p>{c.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                className="border p-2 flex-1 rounded"
              />
              <button
                onClick={handleCommentSubmit}
                className="bg-[#4a2c1a] text-white px-4 py-2 rounded hover:bg-[#633b25]"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
