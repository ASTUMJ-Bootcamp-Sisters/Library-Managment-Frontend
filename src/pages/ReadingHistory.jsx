
import { useEffect } from "react";
import { Card } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import useBorrowStore from "../store/borrowStore";

const ReadingHistory = () => {
  const { borrowHistory, isLoading, error, fetchStudentBorrowHistory } = useBorrowStore();

  useEffect(() => {
    fetchStudentBorrowHistory();
  }, [fetchStudentBorrowHistory]);

  // Function to get status with appropriate styling
  const getStatusWithStyle = (status) => {
    const statusStyles = {
      Pending: "text-yellow-600",
      Borrowed: "text-blue-600",
      Returned: "text-green-600",
      Overdue: "text-red-600"
    };
    
    return <span className={statusStyles[status] || ""}>{status}</span>;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Reading History</h2>
      
      <Card className="overflow-x-auto overflow-y-auto max-h-[60vh] min-w-[700px]">
        {isLoading ? (
          <div className="p-4">Loading reading history...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : borrowHistory.length === 0 ? (
          <div className="p-4 text-center">You haven't borrowed any books yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Borrowed Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrowHistory.map((borrow) => (
                <TableRow key={borrow._id}>
                  <TableCell>
                    {borrow.book?.image ? (
                      <img
                        src={borrow.book.image}
                        alt={borrow.book.title}
                        className="h-12 w-10 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-10 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs">No img</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{borrow.book?.title || "Unavailable"}</TableCell>
                  <TableCell>{borrow.book?.author || "Unknown"}</TableCell>
                  <TableCell>{new Date(borrow.borrowDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(borrow.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {borrow.returnDate 
                      ? new Date(borrow.returnDate).toLocaleDateString() 
                      : "Not returned"}
                  </TableCell>
                  <TableCell>{getStatusWithStyle(borrow.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default ReadingHistory;
