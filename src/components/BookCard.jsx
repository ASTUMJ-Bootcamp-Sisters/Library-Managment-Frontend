import { Button } from "@/components/ui/button";

const BookCard = ({ book, onBorrow, onViewDetails }) => (
  <div className="relative bg-gradient-to-br from-[#fffaf3] via-[#fdf0e0] to-[#e6c9a9] shadow-lg rounded-2xl p-4 flex flex-col items-center hover:shadow-2xl transition-all duration-300 overflow-hidden">
    
    {/* Book Image */}
    <div className="w-full h-56 rounded-lg flex justify-center items-center overflow-hidden bg-transparent">
      <img src={book.image} alt={book.title} className="w-full h-full object-contain" />
    </div>

    {/* Book Info */}
    <h3 className="text-lg font-bold mt-3 text-[#4b2e1f]">{book.title}</h3>
    <p className="text-sm text-[#6b4226]">{book.author}</p>
    <p className="text-sm text-[#8b5e3c]">{book.category.name}</p>
    <p className="text-sm text-[#8b5e3c]">{book.category.type}</p>

    {/* Buttons */}
    <div className="mt-4 flex gap-2 w-full justify-center">
      {book.isBorrowed ? (
        <p className="px-4 py-2 rounded-xl bg-gray-300 text-gray-700 font-semibold">Borrowed</p>
      ) : (
        <Button onClick={() => onBorrow(book)} className="bg-[#5a3825] hover:bg-[#8b5e3c] text-white">
          Borrow
        </Button>
      )}
      <Button onClick={() => onViewDetails(book)} className="bg-[#8b5e3c] hover:bg-[#5a3825] text-white">
        View Details
      </Button>
    </div>
  </div>
);

export default BookCard;
