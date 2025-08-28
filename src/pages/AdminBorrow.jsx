import { useEffect, useState } from "react";
import { getAllBorrows } from "../api/borrowApi";
import { FaExclamationTriangle } from "react-icons/fa"; // ⚠️ FontAwesome icon

export default function AdminBorrow() {
  const [borrows, setBorrows] = useState([]);

  const fakeData = [
    { _id: "1", status: "Borrowed", dueDate: "2025-09-01", student: { name: "Hayat" }, book: { title: "ሀያቱ ሰሃባ", author: "Author 1", coverImage: "https://iili.io/K9A2K2p.jpg" } },
    { _id: "2", status: "Returned", dueDate: "2025-08-15", student: { name: "Iman" }, book: { title: "ቀዳእ ወል ቀደር", author: "Author 2", coverImage: "https://iili.io/K9AHS6l.jpg" } },
    { _id: "3", status: "Borrowed", dueDate: "2025-09-10", student: { name: "Siham" }, book: { title: "የነብዩ ሰለላሁ ዓለይሂ ወሰለም ተአምራት", author: "Author 3", coverImage: "https://iili.io/K9ubCcF.md.jpg" } },
    { _id: "4", status: "Borrowed", dueDate: "2025-09-05", student: { name: "Hanan" }, book: { title: "ፍቅርህ አሸነፈ", author: "Author 4", coverImage: "https://iili.io/K9uptGp.jpg" } },
    { _id: "5", status: "Returned", dueDate: "2025-09-12", student: { name: "Feti" }, book: { title: "የመጨረሻው እስትንፋስ", author: "Author 5", coverImage: "https://iili.io/K9uhKt2.md.jpg" } },
  ];

  useEffect(() => {
    getAllBorrows()
      .then((res) => setBorrows(res.data && res.data.length > 0 ? res.data : fakeData))
      .catch((err) => {
        console.error(err);
        setBorrows(fakeData);
      });
  }, []);

  const statusColor = (status) =>
    status === "Borrowed"
      ? "bg-yellow-200 text-yellow-900"
      : "bg-green-200 text-green-900";

  // Dynamic due-date color
  const getDueDateColor = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-600 font-semibold"; // overdue
    if (diffDays <= 3) return "text-orange-600 font-semibold"; // urgent
    return "text-green-600 font-medium"; // safe
  };

  // Check if overdue for icon
  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">📊 All Borrow Records</h2>
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
          <thead className="bg-indigo-100">
            <tr>
              <th className="py-3 px-5 text-left text-sm font-semibold text-gray-700">Student</th>
              <th className="py-3 px-5 text-left text-sm font-semibold text-gray-700">Book</th>
              <th className="py-3 px-5 text-left text-sm font-semibold text-gray-700 hidden sm:table-cell">Author</th>
              <th className="py-3 px-5 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="py-3 px-5 text-left text-sm font-semibold text-gray-700 hidden md:table-cell">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {borrows.map((b, index) => {
              const dueClass = getDueDateColor(b.dueDate);
              return (
                <tr
                  key={b._id}
                  className={`border-b transition-colors hover:bg-indigo-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                  }`}
                >
                  <td className="py-3 px-5 text-gray-700 font-medium">{b.student.name}</td>
                  <td className="py-3 px-5 flex items-center gap-3">
                    <img
                      src={b.book.coverImage}
                      alt={b.book.title}
                      className="w-14 h-20 object-cover rounded shadow-sm"
                    />
                    <span className="font-semibold text-gray-800">{b.book.title}</span>
                  </td>
                  <td className="py-3 px-5 text-gray-700 hidden sm:table-cell">{b.book.author}</td>
                  <td className="py-3 px-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className={`py-3 px-5 hidden md:table-cell ${dueClass} flex items-center gap-1`}>
                    {isOverdue(b.dueDate) && <FaExclamationTriangle className="text-red-600" />}
                    {new Date(b.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
