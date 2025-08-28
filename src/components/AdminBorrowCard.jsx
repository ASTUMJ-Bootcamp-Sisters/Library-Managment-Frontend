export default function AdminBorrowCard({ borrow }) {
  const today = new Date();
  const due = new Date(borrow.dueDate);
  const diffMs = due - today;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // Status badge full class
  const statusClass =
    borrow.status === "Borrowed"
      ? "inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800"
      : borrow.status === "Returned"
      ? "inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"
      : "inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800";

  // Due date full class
  const dueDateClass =
    diffDays < 0
      ? "text-red-600 font-semibold text-sm"
      : diffDays <= 3
      ? "text-orange-600 font-semibold text-sm"
      : "text-green-600 font-medium text-sm";

  // Progress bar
  const progressPercent =
    diffDays < 0 ? 100 : Math.min(100, Math.max(0, ((30 - diffDays) / 30) * 100));
  const progressColor =
    diffDays < 0 ? "bg-red-600" : diffDays <= 3 ? "bg-orange-600" : "bg-green-600";

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 max-w-xs">
      
      {/* Book Cover */}
      <div
        className="w-full bg-white flex items-center justify-center"
        style={{ aspectRatio: "3/4" }}
      >
        <img
          src={borrow.book.coverImage || "https://via.placeholder.com/150x220?text=No+Cover"}
          alt={borrow.book.title}
          className="object-contain max-h-full p-3"
        />
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-2">
        <h3 className="text-lg font-bold text-gray-900 truncate">{borrow.book.title}</h3>
        <p className="text-gray-600 text-sm">
          Author: <span className="font-medium">{borrow.book.author}</span>
        </p>
        <p className="text-gray-600 text-sm">
          Student: <span className="font-medium">{borrow.student.name}</span>
        </p>

        {/* Due Date */}
        <p className={dueDateClass}>
          Due: {due.toLocaleDateString()}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className={`${progressColor} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Status Badge */}
        <span className={statusClass}>{borrow.status}</span>
      </div>
    </div>
  );
}


