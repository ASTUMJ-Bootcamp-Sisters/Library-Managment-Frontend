import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addComment, getBookById, rateBook } from "../api/bookApi";
import { borrowBook } from "../api/borrowApi";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [book, setBook] = useState({ comments: [], averageRating: 0 });
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [borrowDuration, setBorrowDuration] = useState("1w");
  const [idCardImage, setIdCardImage] = useState(null);
  const [paymentImage, setPaymentImage] = useState(null);
  const [borrowNote, setBorrowNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userMembership, setUserMembership] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, this would come from authentication context
  const currentUserId = "currentUserId";

  // Check user membership status
  const checkMembershipStatus = async () => {
    try {
      // In a real app, we would fetch this from the membership API
      // For now, let's simulate a membership check
      // setUserMembership({ status: "Active" }); // For testing as a member
      setUserMembership(null); // For testing as a non-member
    } catch (err) {
      console.error("Error checking membership status:", err);
      setUserMembership(null);
    }
  };

  const fetchBook = useCallback(async () => {
    try {
      const data = await getBookById(id);
      setBook({
        ...data,
        averageRating: Number(data.averageRating) || 0,
        comments: data.comments || [],
      });

      const currentUserComment = data.comments?.find(
        (c) => c.user?._id === currentUserId
      );
      if (currentUserComment) setUserRating(currentUserComment.rating || 0);
    } catch (err) {
      console.error("Error fetching book:", err);
      toast({
        title: "Error",
        description: "Failed to load book details",
        variant: "destructive"
      });
    }
  }, [id, toast, currentUserId]);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await fetchBook();
      await checkMembershipStatus();
      setIsLoading(false);
    };
    
    initializeData();
  }, [id, fetchBook]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment(id, { text: newComment, rating: userRating });
      setNewComment("");
      fetchBook();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleRatingSubmit = async (value) => {
    setUserRating(value);
    try {
      await rateBook(id, { value });
      fetchBook();
    } catch (err) {
      console.error("Error submitting rating:", err);
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive"
      });
    }
  };

  const handleBorrowDialogOpen = () => {
    if (book.available <= 0) {
      toast({
        title: "Book unavailable",
        description: "This book is currently out of stock",
        variant: "destructive"
      });
      return;
    }
    setBorrowDialogOpen(true);
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
    }
  };

  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    const isMember = userMembership?.status === "Active";
    if (!isMember) {
      if (!idCardImage) {
        toast({
          title: "ID Card Required",
          description: "Please upload your ID card image",
          variant: "destructive"
        });
        return;
      }
      if (!paymentImage) {
        toast({
          title: "Payment Proof Required",
          description: "Please upload payment proof",
          variant: "destructive"
        });
        return;
      }
    }

    try {
      setIsSubmitting(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("bookId", id);
      formData.append("duration", borrowDuration);
      
      if (borrowNote) {
        formData.append("note", borrowNote);
      }
      
      // Only append files for non-members
      if (!isMember) {
        formData.append("idCardImage", idCardImage);
        formData.append("paymentImage", paymentImage);
      }

      const response = await borrowBook(formData);
      
      setBorrowDialogOpen(false);
      
      // Clear form
      setBorrowDuration("1w");
      setBorrowNote("");
      setIdCardImage(null);
      setPaymentImage(null);
      
      toast({
        title: "Success",
        description: response.isMember 
          ? "Book borrowed successfully" 
          : "Borrow request submitted successfully and awaiting approval",
        variant: "default"
      });
      
    } catch (err) {
      console.error("Error borrowing book:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to borrow book",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-6 h-6 text-[#4a2c1a]" />
        <span className="text-lg font-semibold text-[#4a2c1a]">Back</span>
      </div>
      
      {/* Borrow Dialog */}
      <Dialog open={borrowDialogOpen} onOpenChange={setBorrowDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Borrow Book</DialogTitle>
            <DialogDescription>
              {userMembership?.status === "Active" ? (
                "Complete the form below to borrow this book."
              ) : (
                "As a non-member, you need to upload your ID card and payment proof to borrow this book."
              )}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleBorrowSubmit} className="space-y-4">
            {/* Duration Selection */}
            <div className="space-y-2">
              <Label>Borrowing Duration</Label>
              <RadioGroup value={borrowDuration} onValueChange={setBorrowDuration} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1w" id="1w" />
                  <Label htmlFor="1w">1 Week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2w" id="2w" />
                  <Label htmlFor="2w">2 Weeks</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* ID Card Upload (for non-members) */}
            {userMembership?.status !== "Active" && (
              <div className="space-y-2">
                <Label htmlFor="idCard">ID Card Image (Required)</Label>
                <input
                  type="file"
                  id="idCard"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setIdCardImage)}
                  className="w-full border rounded p-2"
                />
              </div>
            )}
            
            {/* Payment Proof Upload (for non-members) */}
            {userMembership?.status !== "Active" && (
              <div className="space-y-2">
                <Label htmlFor="payment">Payment Screenshot (Required)</Label>
                <input
                  type="file"
                  id="payment"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setPaymentImage)}
                  className="w-full border rounded p-2"
                />
              </div>
            )}
            
            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="note">Notes (Optional)</Label>
              <Textarea
                id="note"
                value={borrowNote}
                onChange={(e) => setBorrowNote(e.target.value)}
                placeholder="Add any special requests or notes"
                className="w-full"
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setBorrowDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#4a2c1a] hover:bg-[#633b25]" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Borrow"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex justify-center">
          <img src={book.image} alt={book.title} className="w-full h-80 object-contain rounded-lg border border-gray-200" />
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-[#4a2c1a]">{book.title}</h1>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Category:</strong> {book.category?.name || "N/A"} ({book.category?.type || "N/A"})</p>
          <p><strong>Language:</strong> {book.language || "N/A"}</p>
          <p><strong>Publisher:</strong> {book.publisher || "N/A"}</p>
          <p><strong>Year:</strong> {book.year || "N/A"}</p>
          <p><strong>ISBN:</strong> {book.isbn || "N/A"}</p>
          <p><strong>Available:</strong> {book.available || 0}</p>
          <p><strong>Description:</strong> {book.description || "N/A"}</p>

          <p className="mt-1 font-semibold">
            Average Rating: {book.averageRating.toFixed(1)} ⭐ ({book.comments.length} reviews)
          </p>

          <div className="flex items-center gap-2 mt-2">
            <span>Your Rating:</span>
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                className={`text-2xl ${userRating >= star ? "text-yellow-500" : "text-gray-300"}`}
                onClick={() => handleRatingSubmit(star)}
              >★</button>
            ))}
          </div>

          {/* Borrow Button */}
          <div className="mt-4">
            <Button 
              className="bg-[#4a2c1a] hover:bg-[#633b25]" 
              onClick={handleBorrowDialogOpen}
              disabled={book.available <= 0}
            >
              {book.available > 0 ? "Borrow this book" : "Currently unavailable"}
            </Button>
            <p className="mt-1 text-sm text-gray-500">
              {book.available > 0 
                ? `${book.available} copies available` 
                : "All copies are currently borrowed"}
            </p>
          </div>

          {/* Comments Section */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Comments</h2>
            {book.comments.length > 0 ? (
              book.comments.map((c) => (
                <div key={c._id} className="border-b py-2 flex gap-2 items-start">
                  <div className="flex-1">
                    <p className="font-semibold">{c.user?.name || "User"}</p>
                    <p>{c.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                className="border p-2 flex-1 rounded"
              />
              <button
                onClick={handleCommentSubmit}
                className="bg-[#4a2c1a] text-white px-4 py-2 rounded hover:bg-[#633b25]"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
