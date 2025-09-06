
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/auth";

const FavouritePage = () => {
  const navigate = useNavigate();
  const [favourites, setFavourites] = useState([]);
  const [visible, setVisible] = useState(5);

  // Fetch favourites from backend
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await api.get("/favorites");
        // Map favorites to their book objects, but keep _id for removal
        const books = (Array.isArray(res.data) ? res.data : res.data.favourites || []).map(fav => ({
          ...fav.book,
          _favoriteId: fav._id // keep favorite id for removal
        }));
        setFavourites(books);
      } catch (err) {
        console.error("Error fetching favourites:", err);
      }
    };
    fetchFavourites();
  }, []);

  const imageUrl = (book) => book.image || "/placeholder.jpg";

  // Remove book from favourites
  const removeFavourite = async (bookId, favoriteId) => {
    try {
  await api.delete(`/favorites/${bookId}`);
      setFavourites(prev => prev.filter(b => b._favoriteId !== favoriteId));
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
                    key={book._favoriteId}
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
                      className="mt-2 flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg shadow hover:scale-105 hover:from-red-500 hover:to-red-700 transition-all duration-150"
                      onClick={() => removeFavourite(book._id, book._favoriteId)}
                      title="Remove from favourites"
                    >
                      <Heart className="w-4 h-4 text-white" fill="currentColor" />
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