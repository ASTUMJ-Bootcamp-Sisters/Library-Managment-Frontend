import { Button } from "@/components/ui/button";

const BookCard = ({ book, onBorrowClick, onViewDetails }) => (
  <div className="relative bg-gradient-to-br from-[#fffaf3] via-[#fdf0e0] to-[#e6c9a9] shadow-lg rounded-2xl p-3 sm:p-4 flex flex-col items-center hover:shadow-2xl transition-all duration-300 overflow-hidden w-full max-w-xs mx-auto">
    
    {/* Book Image */}
    <div className="w-full h-40 sm:h-56 rounded-lg flex justify-center items-center overflow-hidden bg-transparent">
      <img src={book.image} alt={book.title} className="w-24 h-32 sm:w-full sm:h-full object-contain" />
    </div>

    {/* Book Info */}
    <h3 className="text-base sm:text-lg font-bold mt-3 text-[#4b2e1f] text-center w-full truncate">{book.title}</h3>
    <p className="text-xs sm:text-sm text-[#6b4226] text-center w-full truncate">{book.author}</p>
    <p className="text-xs sm:text-sm text-[#8b5e3c] text-center w-full truncate">{book.category?.name}</p>
    {book.category?.type && (
      <p className="text-xs sm:text-sm text-[#8b5e3c] text-center w-full truncate">{book.category.type}</p>
    )}

    {/* Buttons */}
    <div className="mt-4 flex flex-col gap-2 w-full">
      {book.isBorrowed ? (
        <p className="px-4 py-2 rounded-xl bg-gray-300 text-gray-700 font-semibold w-full text-center">Borrowed</p>
      ) : (
        <Button onClick={() => onBorrowClick(book)} className="bg-[#5a3825] hover:bg-[#8b5e3c] text-white w-full">
          Borrow
        </Button>
      )}
      <Button onClick={() => onViewDetails(book)} className="bg-[#5a3825] hover:bg-[#8b5e3c] text-white w-full">
        View Details
      </Button>
    </div>
  </div>
);

export default BookCard;
