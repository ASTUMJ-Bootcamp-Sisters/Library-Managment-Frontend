import { Button } from "@/components/ui/button";

const BookCard = ({ book, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition">
      <img src={book.image} alt={book.title} className="w-full h-48 object-cover rounded" />
      <h3 className="text-lg font-bold mt-2">{book.title}</h3>
      <p className="text-sm text-gray-600">{book.author}</p>
      <p className="text-sm text-gray-500">{book.category}</p>
      {onEdit && onDelete && (
        <div className="flex gap-2 mt-2">
          <Button onClick={onEdit}>Edit</Button>
          <Button variant="destructive" onClick={onDelete}>Delete</Button>
        </div>
      )}
    </div>
  );
};

export default BookCard;
