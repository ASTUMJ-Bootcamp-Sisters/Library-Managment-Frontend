
import { useEffect, useState } from "react";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FavouritePage = () => {
  const navigate = useNavigate();
  const [favourites, setFavourites] = useState([]);
  const [visible, setVisible] = useState(5);

  // Fetch favourites from backend
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await axios.get("/api/favourites", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFavourites(res.data.favourites || []);
      } catch (err) {
        console.error("Error fetching favourites:", err);
      }
    };

    fetchFavourites();
  }, []);

  const imageUrl = (book) => book.image || "/placeholder.jpg";

  // Remove book from favourites
  const removeFavourite = async (bookId) => {
    try {
      const res = await axios.post(
        "/api/favourites/remove",
        { bookId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setFavourites(res.data.favourites);
    } catch (err) {
      console.error("Error removing favourite:", err);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-start items-center p-6 bg-gradient-to-b from-[#d7c0ae] via-[#c8a98f] to-[#d7c0ae]">
      <div className="relative w-full">
        {/* Page Header */}
        <div className="bg-[#f7f2ec] rounded-2xl shadow-xl p-6 border border-[#b3937d] mb-6 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[#4b2e2b] flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-500" /> My Favourite Books
          </h1>
          <p className="text-[#6d4c41] mt-2">
            Here are the books you have added to your favourites. ❤️
          </p>
        </div>

        {/* Favourite Books Shelf */}
        <div className="flex flex-col items-center w-full">
          <h2 className="text-xl font-semibold text-[#4b2e2b] mb-2 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" /> Favourite Collection
          </h2>
          <div className="relative w-full flex flex-row gap-6 justify-center items-end pb-10">
            {/* Wooden Shelf */}
            <div className="absolute left-0 right-0 bottom-0 h-10 bg-gradient-to-r from-[#8d6e63] to-[#6d4c41] rounded-b-2xl shadow-lg border-b-4 border-[#4e342e] z-0" />

            {/* Books */}
            <div className="relative flex flex-row gap-6 justify-center items-end w-full z-10">
              {favourites.length > 0 ? (
                favourites.slice(0, visible).map((book) => (
                  <div
                    key={book._id}
                    className="flex flex-col items-center cursor-pointer"
                    style={{ minWidth: "90px", maxWidth: "120px" }}
                  >
                    <img
                      src={imageUrl(book)}
                      alt={book.title}
                      className="w-20 h-28 object-cover rounded-md border border-[#5d4037] shadow-md hover:scale-105 transition-transform"
                      onClick={() => navigate(`/book/${book._id}`)}
                    />
                    <h3 className="font-medium text-[#4b2e2b] text-center mt-2 text-sm truncate w-full">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#6d4c41] text-center">
                      {book.author}
                    </p>
                    <button
                      onClick={() => removeFavourite(book._id)}
                      className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded-lg shadow hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-[#6d4c41]">No favourite books yet.</p>
              )}

              {/* Arrow Button */}
              {favourites.length > 5 && (
                <div className="flex flex-col justify-end">
                  {visible < favourites.length ? (
                    <button
                      className="p-2 bg-[#4e342e] text-white rounded-full shadow-lg hover:bg-[#3e2723] transition"
                      onClick={() => setVisible(visible + 5)}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  ) : visible > 5 ? (
                    <button
                      className="p-2 bg-[#4e342e] text-white rounded-full shadow-lg hover:bg-[#3e2723] transition"
                      onClick={() => setVisible(5)}
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
  );
};

export default FavouritePage;

