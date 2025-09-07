import { useEffect } from "react";
import { Card } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import useBorrowStore from "../store/borrowStore";

const ReadingHistory = () => {
  const { borrowHistory, isLoading, error, fetchStudentBorrowHistory, returnBook } = useBorrowStore();

  useEffect(() => {
    fetchStudentBorrowHistory();
  }, [fetchStudentBorrowHistory]);

  // Function to get status with appropriate styling
  const getStatusWithStyle = (status) => {
    const statusStyles = {
      Pending: "text-yellow-600 font-semibold",
      Borrowed: "text-blue-600 font-semibold",
      Returned: "text-green-600 font-semibold",
      Overdue: "text-red-600 font-semibold"
    };
    return <span className={statusStyles[status] || ""}>{status}</span>;
  };

  const handleReturn = async (borrowId) => {
    await returnBook(borrowId);
    fetchStudentBorrowHistory();
  };

  return (
    <div className="min-h-screen bg-[#fffaf3] p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 sticky top-0 z-10 bg-[#fffaf3] py-4 px-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-extrabold text-[#4a2c1a]">My Reading History</h2>
      </div>

      {/* Table Container */}
      <div className="max-w-7xl mx-auto">
        <Card className="overflow-x-auto overflow-y-auto max-h-[70vh] p-6 bg-white shadow-lg rounded-xl">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading reading history...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : borrowHistory.length === 0 ? (
            <div className="p-4 text-center text-gray-500">You haven't borrowed any books yet.</div>
          ) : (
            <Table className="min-w-full border-collapse">
              <TableHeader>
                <TableRow className="bg-[#f3e8df] sticky top-0 z-20">
                  <TableHead className="text-left px-4 py-2">Book</TableHead>
                  <TableHead className="text-left px-4 py-2">Title</TableHead>
                  <TableHead className="text-left px-4 py-2">Author</TableHead>
                  <TableHead className="text-left px-4 py-2">Borrowed Date</TableHead>
                  <TableHead className="text-left px-4 py-2">Due Date</TableHead>
                  <TableHead className="text-left px-4 py-2">Return Date</TableHead>
                  <TableHead className="text-left px-4 py-2">Status</TableHead>
                  <TableHead className="text-left px-4 py-2">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowHistory.map((borrow) => (
                  <TableRow key={borrow._id} className="hover:bg-[#f9f5f1] transition-colors rounded-md">
                    <TableCell className="px-4 py-2">
                      {borrow.book?.image ? (
                        <img
                          src={borrow.book.image}
                          alt={borrow.book.title}
                          className="h-12 w-10 object-cover rounded shadow-sm"
                        />
                      ) : (
                        <div className="h-12 w-10 bg-gray-200 rounded flex items-center justify-center shadow-sm">
                          <span className="text-xs text-gray-500">No img</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-2 font-medium">{borrow.book?.title || "Unavailable"}</TableCell>
                    <TableCell className="px-4 py-2">{borrow.book?.author || "Unknown"}</TableCell>
                    <TableCell className="px-4 py-2">{new Date(borrow.borrowDate).toLocaleDateString()}</TableCell>
                    <TableCell className="px-4 py-2">{new Date(borrow.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell className="px-4 py-2">
                      {borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : "Not returned"}
                    </TableCell>
                    <TableCell className="px-4 py-2">{getStatusWithStyle(borrow.status)}</TableCell>
                    <TableCell className="px-4 py-2">
                      {borrow.status === "Borrowed" && !borrow.returnDate && (
                        <Button
                          variant="outline"
                          className="text-blue-700 border-blue-700 hover:bg-blue-50"
                          onClick={() => handleReturn(borrow._id)}
                        >
                          Return
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ReadingHistory;
