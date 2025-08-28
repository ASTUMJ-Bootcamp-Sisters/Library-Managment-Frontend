import { Button } from "@/components/ui/button";

const BookCard = ({ book }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Book Image */}
      <div className="w-full h-56 overflow-hidden rounded-lg">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Book Info */}
      <h3 className="text-lg font-semibold mt-3">{book.title}</h3>
      <p className="text-sm text-gray-600">{book.author}</p>
      <p className="text-sm text-gray-500">{book.category.name}</p>
      <p className="text-sm text-gray-500">{book.category.type}</p>

      {/* Borrow Button */}
      <Button
        className="bg-[#5c4033] hover:bg-[#7b5e57] text-white mt-4"
      >
        Borrow
      </Button>
    </div>
  );
};

export default BookCard;