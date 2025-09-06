import { useEffect, useState } from "react";
import axios from "axios";

const BookReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    bookTitle: "",
    author: "",
    image: "",
    dateTime: "",
    location: "",
    gender: "Both",
    eventNumber: "",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const res = await axios.get("/api/book-reviews");
    setReviews(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/book-reviews", formData);
    setFormData({
      bookTitle: "",
      author: "",
      image: "",
      dateTime: "",
      location: "",
      gender: "Both",
      eventNumber: "",
    });
    setFormVisible(false);
    fetchReviews();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/book-reviews/${id}`);
    fetchReviews();
  };

  return (
    <div className="min-h-screen bg-[#fffaf3] p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        📚 Upcoming Book Review Events
      </h1>

      {/* Add Event Button */}
      <div className="text-center mb-6">
        <button
          className="bg-[#4b2e2b] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#3e2723]"
          onClick={() => setFormVisible(!formVisible)}
        >
          ➕ Add New Book Review Event
        </button>
      </div>

      {/* Event Form */}
      {formVisible && (
        <form
          className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mb-6"
          onSubmit={handleSubmit}
        >
          <input
            className="border p-2 w-full mb-3"
            type="text"
            placeholder="📚 Book Title"
            value={formData.bookTitle}
            onChange={(e) =>
              setFormData({ ...formData, bookTitle: e.target.value })
            }
            required
          />
          <input
            className="border p-2 w-full mb-3"
            type="text"
            placeholder="✍️ Author"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            required
          />
          <input
            className="border p-2 w-full mb-3"
            type="text"
            placeholder="🖼 Image URL"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
          />
          <input
            className="border p-2 w-full mb-3"
            type="datetime-local"
            value={formData.dateTime}
            onChange={(e) =>
              setFormData({ ...formData, dateTime: e.target.value })
            }
            required
          />
          <input
            className="border p-2 w-full mb-3"
            type="text"
            placeholder="📍 Location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
          />
          <select
            className="border p-2 w-full mb-3"
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
          >
            <option value="Male">🧔 Male</option>
            <option value="Female">🧕 Female</option>
            <option value="Both">Both</option>
          </select>
          <input
            className="border p-2 w-full mb-3"
            type="text"
            placeholder="0️⃣ Event Number"
            value={formData.eventNumber}
            onChange={(e) =>
              setFormData({ ...formData, eventNumber: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
          >
            Save Event
          </button>
        </form>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center"
          >
            <img
              src={review.image || "/placeholder.jpg"}
              alt={review.bookTitle}
              className="w-32 h-40 object-cover rounded-md mb-3"
            />
            <h2 className="text-lg font-bold">📚 {review.bookTitle}</h2>
            <p>✍️ {review.author}</p>
            <p>📆 {new Date(review.dateTime).toLocaleString()}</p>
            <p>📍 {review.location}</p>
            <p>{review.gender === "Male" ? "🧔 Male" : review.gender === "Female" ? "🧕 Female" : "🧕🧔 Both"}</p>
            <p>0️⃣ {review.eventNumber}</p>

            <button
              onClick={() => handleDelete(review._id)}
              className="mt-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              🗑 Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookReviewPage;
