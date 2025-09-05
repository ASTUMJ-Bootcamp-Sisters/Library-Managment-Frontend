import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send } from "lucide-react";
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
      const response = await getBookById(id);
      const bookData = response?.data || response;
      setBook({
        ...bookData,
        averageRating: Number(bookData.averageRating) || 0,
        comments: bookData.comments || [],
      });

      const currentUserComment = bookData.comments?.find(
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
    <div className="min-h-screen bg-[#fffaf3] p-6">
      {/* Back Button */}
      <div
        className="flex items-center gap-2 mb-6 cursor-pointer"
        onClick={() => navigate(-1)}
      >
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

      {/* Book Container */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row gap-6">
        {/* Book Image */}
        <div className="md:w-1/3 flex justify-center items-start">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-auto max-h-[500px] object-contain rounded-lg border border-gray-200 shadow-md"
          />
        </div>

        {/* Book Details */}
        <div className="md:w-2/3 flex flex-col gap-3">
          <h1 className="text-4xl font-extrabold text-[#4a2c1a]">{book.title}</h1>
          <p className="text-lg text-gray-700"><strong>Author:</strong> {book.author}</p>
          <p className="text-lg text-gray-700">
            <strong>Category:</strong> {book.category?.name || "N/A"} ({book.category?.type || "N/A"})
          </p>
          <p className="text-lg text-gray-700"><strong>Language:</strong> {book.language || "N/A"}</p>
          <p className="text-lg text-gray-700"><strong>Publisher:</strong> {book.publisher || "N/A"}</p>
          <p className="text-lg text-gray-700"><strong>Year:</strong> {book.year || "N/A"}</p>
          <p className="text-lg text-gray-700"><strong>ISBN:</strong> {book.isbn || "N/A"}</p>
          <p className="text-lg text-gray-700"><strong>Available:</strong> {book.available || 0}</p>
          <p className="text-lg text-gray-700"><strong>Description:</strong> {book.description || "N/A"}</p>

          {/* Average Rating */}
          <p className="mt-2 font-semibold text-yellow-600">
            ⭐ Average Rating: {book.averageRating.toFixed(1)} ({book.comments.length} reviews)
          </p>
        </div>
      </div>

      {/* Rating Section */}
      <div className="max-w-6xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-[#4a2c1a] mb-4">Your Rating</h2>
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`text-3xl ${userRating >= star ? "text-yellow-500" : "text-gray-300"}`}
              onClick={() => handleRatingSubmit(star)}
            >
              ★
            </button>
          ))}
        </div>

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
        <h2 className="text-2xl font-bold text-[#4a2c1a] mb-4">Comments</h2>
        {book.comments.length > 0 ? (
          book.comments.map((c) => (
            <div key={c._id} className="border-b py-3 flex gap-3 items-start">
              <Avatar className="bg-slate-400">
                {c.user?.profileImage ? (
                  <AvatarImage src={c.user.profileImage} alt={c.user?.fullName || "User"} />
                ) : (
                  <AvatarFallback>
                    {c.user?.fullName ? c.user.fullName.split(" ").map(n => n[0]).join("") : "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{c.user?.fullName || "User"}</p>
                <p className="text-gray-700">{c.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}

        {/* Add Comment */}
        <div className="mt-6 flex gap-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCommentSubmit();
              }
            }}
            placeholder="Add a comment..."
            className="flex-1 resize-none h-16 rounded border border-gray-300"
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-[#4a2c1a] text-white px-5 py-3 rounded hover:bg-[#633b25] flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
