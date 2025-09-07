import { useEffect, useState } from "react";
import useBookReviewStore from "../store/bookReviewStore";

const initialForm = {
  bookTitle: "",
  author: "",
  image: "",
  dateTime: "",
  location: "",
  gender: "Both",
  eventNumber: "",
};

const AdminBookReview = () => {
  const { reviews, loading, error, fetchReviews, addReview, deleteReview } = useBookReviewStore();
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addReview(form);
    setForm(initialForm);
    setShowForm(false);
  };

  return (
    <div className="p-6 bg-[#fdf8f3] min-h-screen">
      <h1 className="text-2xl font-bold text-[#5c4033] mb-4">Manage Book Reviews</h1>
      <button
        className="mb-4 px-4 py-2 bg-[#5c4033] text-white rounded shadow hover:bg-[#7b5e57]"
        onClick={() => setShowForm((v) => !v)}
      >
        {showForm ? "Cancel" : "Add Book Review"}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 border border-[#e6d5c3] max-w-lg">
          <div className="mb-2">
            <label className="block font-medium mb-1">Book Title</label>
            <input name="bookTitle" value={form.bookTitle} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Author</label>
            <input name="author" value={form.author} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Image URL</label>
            <input name="image" value={form.image} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Date & Time</label>
            <input type="datetime-local" name="dateTime" value={form.dateTime} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Location</label>
            <input name="location" value={form.location} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded px-2 py-1">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Event Number</label>
            <input name="eventNumber" value={form.eventNumber} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
          </div>
          <button type="submit" className="mt-2 px-4 py-2 bg-[#5c4033] text-white rounded shadow hover:bg-[#7b5e57]">Submit</button>
        </form>
      )}
      <div className="bg-white p-4 rounded shadow border border-[#e6d5c3]">
        <h2 className="text-lg font-semibold text-[#5c4033] mb-2">Book Reviews</h2>
        {loading ? (
          <div className="text-[#7b5e57]">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="text-[#7b5e57]">No reviews found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <div key={review._id} className="border rounded p-4 shadow bg-[#fdf8f3] flex flex-col gap-2">
                <img src={review.image || "/public/loginpic.jpeg"} alt={review.bookTitle} className="w-full h-32 object-cover rounded mb-2 border bg-gray-100" />
                <h3 className="font-bold text-[#5c4033]">{review.bookTitle}</h3>
                <p className="text-sm text-[#7b5e57]">Author: {review.author}</p>
                <p className="text-sm text-[#7b5e57]">Location: {review.location}</p>
                <p className="text-sm text-[#7b5e57]">Date: {new Date(review.dateTime).toLocaleString()}</p>
                <p className="text-sm text-[#7b5e57]">Gender: {review.gender}</p>
                <p className="text-xs text-[#a1887f]">Event: {review.eventNumber}</p>
                <button
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => deleteReview(review._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookReview;
