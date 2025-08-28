import { useEffect, useState } from "react";
import { getMyBorrows } from "../api/borrowApi";
import BorrowCard from "../components/BorrowCard";

export default function Borrow() {
  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    getMyBorrows()
      .then((res) => {
        setBorrows(res.data && res.data.length > 0 ? res.data : fakeData);
      })
      .catch((err) => {
        console.error(err);
        setBorrows(fakeData);
      });
  }, []);

  const fakeData = [
    { _id: "1", status: "Borrowed", dueDate: "2025-09-01", book: { title: "ሀያቱ ሰሃባ", author: "Author 1" } },
    { _id: "2", status: "Returned", dueDate: "2025-08-15", book: { title: "ቀዳእ ወል ቀደር", author: "Author 2" } },
    { _id: "3", status: "Borrowed", dueDate: "2025-09-10", book: { title: "የነብዩ ሰለላሁ ዓለይሂ ወሰለም ተአምራት", author: "Author 3" } },
    { _id: "4", status: "Borrowed", dueDate: "2025-09-05", book: { title: "ፍቅርህ አሸነፈ", author: "Author 4" } },
    { _id: "5", status: "Returned", dueDate: "2025-09-12", book: { title: "የመጨረሻው እስትንፋስ", author: "Author 5" } },
  ];

  const coverImages = [
    "https://iili.io/K9A2K2p.jpg",
    "https://iili.io/K9AHS6l.jpg",
    "https://iili.io/K9ubCcF.md.jpg",
    "https://iili.io/K9uptGp.jpg",
    "https://iili.io/K9uhKt2.md.jpg",
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📚 My Borrowed Books</h2>
      {borrows.length === 0 ? (
        <p className="text-gray-600">No borrowed books yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {borrows.map((b, index) => (
            <BorrowCard
              key={b._id}
              borrow={b}
              coverImage={coverImages[index % coverImages.length]}
            />
          ))}
        </div>
      )}
    </div>
  );
}


