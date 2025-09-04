import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import useBorrowStore from "../store/borrowStore";
import useUserStore from "../store/useUserStore";

const BorrowHistory = () => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { adminBorrowHistory, isLoading, error, fetchAdminBorrowHistory } = useBorrowStore();
  const { users, fetchUsers } = useUserStore();
  
  const [filteredHistory, setFilteredHistory] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchAdminBorrowHistory();
  }, [fetchUsers, fetchAdminBorrowHistory]);
  
  // Apply filters whenever adminBorrowHistory, selectedUserId, or statusFilter change
  useEffect(() => {
    let filtered = [...adminBorrowHistory];
    
    // No need to fetch from API again, just filter locally
    if (selectedUserId) {
      filtered = filtered.filter(borrow => borrow.student?._id === selectedUserId);
    }
    
    if (statusFilter) {
      filtered = filtered.filter(borrow => borrow.status === statusFilter);
    }
    
    setFilteredHistory(filtered);
  }, [adminBorrowHistory, selectedUserId, statusFilter]);

  // Handle user filter change
  const handleUserFilterChange = (e) => {
    setSelectedUserId(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

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
      <h2 className="text-2xl font-bold mb-4">Borrowing History</h2>
      
      <div className="mb-4 flex flex-wrap items-end gap-4">
        {/* User Filter Dropdown */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="userFilter" className="block text-sm font-medium mb-1">Filter by User:</label>
          <select
            id="userFilter"
            value={selectedUserId}
            onChange={handleUserFilterChange}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">All Users</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.fullName || user.name || user.email}
              </option>
            ))}
          </select>
        </div>
        
        {/* Status Filter Dropdown */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="statusFilter" className="block text-sm font-medium mb-1">Filter by Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Borrowed">Borrowed</option>
            <option value="Returned">Returned</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
        
        {/* Reset Filters Button */}
        <Button 
          onClick={() => {
            setSelectedUserId("");
            setStatusFilter("");
          }}
          className="bg-[#5c4033] hover:bg-[#7b5e57] text-white py-2 px-4"
        >
          Reset Filters
        </Button>
      </div>
      
      <Card className="overflow-x-auto overflow-y-auto max-h-[60vh] min-w-[700px]">
        {isLoading ? (
          <div className="p-4">Loading borrowing history...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-4 text-center">No borrowing history found with the selected filters.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Borrowed Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((borrow) => (
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
                  <TableCell>{borrow.student?.fullName || borrow.student?.name || borrow.student?.email || "Unknown"}</TableCell>
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

export default BorrowHistory;
