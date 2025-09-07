import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import useBorrowStore from "../store/borrowStore";
import useUserStore from "../store/useUserStore";


const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "Pending", label: "Pending" },
  { key: "Borrowed", label: "Borrowed" },
  { key: "Returned", label: "Returned" },
  { key: "Overdue", label: "Overdue" },
];

const BorrowHistory = () => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const { adminBorrowHistory, isLoading, error, fetchAdminBorrowHistory } = useBorrowStore();
  const { users, fetchUsers } = useUserStore();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchUsers();
    fetchAdminBorrowHistory();
  }, [fetchUsers, fetchAdminBorrowHistory]);

  // Filter borrow history by tab and user
  const getFilteredHistory = () => {
    let filtered = [...adminBorrowHistory];
    if (selectedUserId) {
      filtered = filtered.filter(borrow => borrow.student?._id === selectedUserId);
    }
    if (activeTab !== "all") {
      filtered = filtered.filter(borrow => borrow.status === activeTab);
    }
    return filtered;
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
            onChange={e => setSelectedUserId(e.target.value)}
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
            value={activeTab}
            onChange={e => setActiveTab(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            {STATUS_TABS.map(tab => (
              <option key={tab.key} value={tab.key}>{tab.label}</option>
            ))}
          </select>
        </div>
        {/* Reset Filters Button */}
        <Button 
          onClick={() => {
            setSelectedUserId("");
            setActiveTab("all");
          }}
          className="bg-[#5c4033] hover:bg-[#7b5e57] text-white py-2 px-4"
        >
          Reset Filters
        </Button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          {STATUS_TABS.map(tab => (
            <TabsTrigger key={tab.key} value={tab.key}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>
        {STATUS_TABS.map(tab => (
          <TabsContent key={tab.key} value={tab.key} className="space-y-4">
            <Card className="overflow-x-auto overflow-y-auto max-h-[60vh] min-w-[700px]">
              {isLoading ? (
                <div className="p-4">Loading borrowing history...</div>
              ) : error ? (
                <div className="p-4 text-red-500">{error}</div>
              ) : getFilteredHistory().length === 0 ? (
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
                    {getFilteredHistory().map((borrow) => (
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default BorrowHistory;
