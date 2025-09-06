// import { formatDistanceToNow } from "date-fns";
import { Check, Loader2, RefreshCw, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { toast } from "../hooks/use-toast";
import useBorrowStore from "../store/borrowStore";

const BorrowingRequests = () => {
  const {
    pendingBorrows,
    isLoading,
    error,
    fetchPendingBorrows,
    approveBorrow,
    rejectBorrow,
  } = useBorrowStore();

  useEffect(() => {
    // Fetch pending borrow requests on component mount
    fetchPendingBorrows();
  }, [fetchPendingBorrows]);

  // Handle approve request
  const handleApprove = async (borrowId) => {
    // Log the ID to confirm it's correct
    console.log("Approving borrow request with ID:", borrowId);
    const result = await approveBorrow(borrowId);
    if (result.success) {
      toast({
        title: "Success!",
        description: "Borrow request has been approved.",
      });
    } else {
      toast({
        title: "Error!",
        description: result.error || "Failed to approve request.",
        variant: "destructive",
      });
    }
  };

  // Handle reject request
  const handleReject = async (borrowId) => {
    // Log the ID to confirm it's correct
    console.log("Rejecting borrow request with ID:", borrowId);
    const result = await rejectBorrow(borrowId);
    if (result.success) {
      toast({
        title: "Success!",
        description: "Borrow request has been rejected.",
      });
    } else {
      toast({
        title: "Error!",
        description: result.error || "Failed to reject request.",
        variant: "destructive",
      });
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-blue-100 text-blue-800",
      Borrowed: "bg-green-100 text-green-800",
      Returned: "bg-gray-100 text-gray-800",
      Overdue: "bg-red-100 text-red-800",
      Rejected: "bg-purple-100 text-purple-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#5c4033]">Borrowing Requests</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fetchPendingBorrows()}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-[#5c4033] mb-2">Pending Requests</h2>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#5c4033]" />
          </div>
        ) : pendingBorrows.length === 0 ? (
          <p className="text-center text-gray-500 my-8">No pending borrow requests.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {pendingBorrows.map((borrow) => (
              <Card key={borrow._id} className="p-4 shadow-sm">
                <div className="flex justify-between mb-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(
                      borrow.status
                    )}`}
                  >
                    {borrow.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(borrow.borrowDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mb-3">
                  <p className="font-medium">{borrow.book?.title}</p>
                  <p className="text-sm text-gray-600">by {borrow.book?.author}</p>
                  {borrow.book?.available !== undefined && (
                    <p className="text-xs text-gray-500 mt-1">
                      Available copies: {borrow.book.available}
                    </p>
                  )}
                </div>
                
                <div className="mb-3">
                  <p className="text-sm">
                    <span className="font-medium">Student:</span> {borrow.student?.fullName}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Due Date:</span>{" "}
                    {new Date(borrow.dueDate).toLocaleDateString()}
                  </p>
                </div>
                
                {borrow.book?.image && (
                  <div className="mb-3">
                    <img 
                      src={borrow.book.image} 
                      alt={borrow.book.title}
                      className="w-full h-32 object-cover rounded border border-gray-200"
                    />
                  </div>
                )}

                {/* Uploaded ID Card Image */}
                {borrow.idCardImage && (
                  <div className="mb-3">
                    <span className="font-medium text-sm">ID Card Image:</span>
                    <img
                      src={`http://localhost:5000/${borrow.idCardImage.replace(/\\/g, "/")}`}
                      alt="ID Card"
                      className="w-full h-32 object-contain rounded border border-gray-200 mt-1"
                      style={{ maxWidth: 200 }}
                    />
                  </div>
                )}
                {/* Uploaded Payment Image */}
                {borrow.paymentImage && (
                  <div className="mb-3">
                    <span className="font-medium text-sm">Payment Image:</span>
                    <img
                      src={`http://localhost:5000/${borrow.paymentImage.replace(/\\/g, "/")}`}
                      alt="Payment"
                      className="w-full h-32 object-contain rounded border border-gray-200 mt-1"
                      style={{ maxWidth: 200 }}
                    />
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() => handleApprove(borrow._id)}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(borrow._id)}
                    disabled={isLoading}
                    variant="destructive"
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowingRequests;


