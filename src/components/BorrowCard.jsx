export default function BorrowCard({ borrow, coverImage }) {
  // Status badge colors
  const statusColor = (status) => {
    if (status === "Borrowed") return "bg-yellow-100 text-yellow-800";
    if (status === "Returned") return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  // Due date logic
  const getDueDateInfo = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const totalDays = 14; // assume 14-day borrow period (change if needed)
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    const progress = Math.max(0, Math.min(100, ((totalDays - diffDays) / totalDays) * 100));

    let color = "bg-green-500";
    if (diffDays < 0) color = "bg-red-500"; // overdue
    else if (diffDays <= 3) color = "bg-orange-500"; // urgent

    return { diffDays, color, progress };
  };

  const { diffDays, color, progress } = getDueDateInfo(borrow.dueDate);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
      {/* Book Cover */}
      <div className="aspect-[3/4] w-full bg-white flex items-center justify-center">
        <img
          src={coverImage}
          alt={borrow.book.title}
          className="object-contain max-h-full p-3"
        />
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-3">
        {/* Book Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
          {borrow.book.title}
        </h3>

        {/* Author */}
        <p className="text-gray-600 text-sm">
          by <span className="font-medium">{borrow.book.author}</span>
        </p>

        {/* Due Date */}
        <p className="text-sm">
          Due:{" "}
          <span
            className={
              diffDays < 0
                ? "text-red-600 font-semibold"
                : diffDays <= 3
                ? "text-orange-600 font-semibold"
                : "text-green-600 font-medium"
            }
          >
            {new Date(borrow.dueDate).toLocaleDateString()}
          </span>
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`${color} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Status Badge */}
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${statusColor(
            borrow.status
          )}`}
        >
          {borrow.status}
        </span>
      </div>
    </div>
  );
}
