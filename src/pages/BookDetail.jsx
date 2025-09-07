import { addComment, deleteComment, editComment, getBookById, rateBook } from "@/api/bookApi";
import { borrowBook } from "@/api/borrowApi";
import { addFavorite, checkFavorite, removeFavorite } from "@/api/favoriteApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ArrowLeft, Heart, MoreVertical, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/auth";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [book, setBook] = useState({ comments: [], averageRating: 0 });
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [openMenu, setOpenMenu] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [borrowDuration, setBorrowDuration] = useState("1w");
  const [idCardImage, setIdCardImage] = useState(null);
  const [paymentImage, setPaymentImage] = useState(null);
  const [borrowNote, setBorrowNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userMembership, setUserMembership] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const res = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUserId(res.data._id);
      setCurrentUserRole(res.data.role);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const checkMembershipStatus = async () => {
    try {
      setUserMembership(null); // fake as non-member for now
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
        comments: bookData.comments || []
      });

      const currentUserComment = bookData.comments?.find(
        (c) => c.user?._id?.toString() === currentUserId || c.user?.id?.toString() === currentUserId
      );
      if (currentUserComment) setUserRating(currentUserComment.rating || 0);

      // Only check favorite if user is authenticated
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const favStatus = await checkFavorite(id);
          setIsFavorite(favStatus?.isFavorite || false);
        } catch {
          // If 404, do not show error, just set false
          setIsFavorite(false);
        }
      } else {
        setIsFavorite(false);
      }
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
      await fetchCurrentUser();
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

  const handleEditComment = async (commentId) => {
    if (!editingText.trim()) {
      toast({ 
        title: "Error", 
        description: "Comment cannot be empty", 
        variant: "destructive" 
      });
      return;
    }
    await editComment(commentId, editingText.trim());
    setEditingCommentId(null);
    setEditingText("");
    setOpenMenu(null);
    fetchBook();
    toast({ 
      title: "Success", 
      description: "Comment updated" 
    });
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setBook((prev) => ({
        ...prev,
        comments: prev.comments.filter(c => c._id !== commentId)
      }));
      setOpenMenu(null);
      toast({ 
        title: "Success", 
        description: "Comment deleted" 
      });
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast({ 
        title: "Error", 
        description: "Failed to delete comment", 
        variant: "destructive" 
      });
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
    if (file) setter(file);
  };

  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    const isMember = userMembership?.status === "Active";
    if (!isMember) {
      if (!idCardImage || !paymentImage) {
        toast({ 
          title: "Missing files", 
          description: "Upload ID card and payment proof", 
          variant: "destructive" 
        });
        return;
      }
    }
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("bookId", id);
      formData.append("duration", borrowDuration);
      if (borrowNote) formData.append("note", borrowNote);
      if (!isMember) {
        formData.append("idCardImage", idCardImage);
        formData.append("paymentImage", paymentImage);
      }
      await borrowBook(formData);
      setBorrowDialogOpen(false);
      setBorrowDuration("1w");
      setBorrowNote("");
      setIdCardImage(null);
      setPaymentImage(null);
      toast({ 
        title: "Success", 
        description: "Borrow request submitted" 
      });
    } catch (err) {
      console.error(err);
      toast({ 
        title: "Error", 
        description: "Failed to borrow book", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(id);
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: `${book.title} was removed from your favorites`,
        });
      } else {
        await addFavorite({ bookId: id });
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: `${book.title} was added to your favorites`,
        });
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast({
        title: "Error",
        description: "Could not update favorites",
        variant: "destructive"
      });
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f3e7dd] via-[#e4d0bf] to-[#e9d1c0]">
      <div className="text-xl text-[#5c4033] font-semibold animate-pulse">Loading book details...</div>
    </div>
  );

  return (
  <div className="min-h-screen bg-gradient-to-b from-[#f3e7dd] via-[#e4d0bf] to-[#e9d1c0] p-6">
      {/* Back Button */}
      <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-6 h-6 text-[#5c4033]" />
        <span className="text-lg font-semibold text-[#5c4033]">Back</span>
      </div>

      {/* Borrow Dialog */}
      <Dialog open={borrowDialogOpen} onOpenChange={setBorrowDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Borrow Book</DialogTitle>
            <DialogDescription>
              {userMembership?.status === "Active"
                ? "Complete the form below to borrow this book."
                : "As a non-member, upload your ID card and payment proof to borrow this book."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBorrowSubmit} className="space-y-4">
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
            {userMembership?.status !== "Active" && (
              <>
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
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="note">Notes (Optional)</Label>
              <Textarea 
                id="note" 
                value={borrowNote} 
                onChange={(e) => setBorrowNote(e.target.value)} 
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
                className="bg-[#4f2e19] hover:bg-[#724228] text-white" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Borrow"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Book Container */}
  <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#fffaf3] via-[#fdf0e0] to-[#e6c9a9] shadow-xl rounded-2xl p-8 flex flex-col md:flex-row gap-8 border border-[#e3c1ab]">
        {/* Book Image */}
        <div className="md:w-1/3 flex flex-col items-center justify-start relative">
          <div className="bg-white rounded-xl border-2 border-[#e6d5c3] shadow-lg p-4 flex flex-col items-center w-full">
            <img 
              src={book.image} 
              alt={book.title} 
              className="w-48 h-64 object-cover rounded-lg border border-[#e6d5c3] shadow-md mb-2" 
            />
            {/* Favorite Button */}
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg border border-[#e6d5c3] hover:scale-110 transition"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-7 h-7 ${isFavorite ? "fill-red-500 text-red-500" : "text-[#bca18a]"}`} />
            </button>
          </div>
        </div>
        
        {/* Book Details */}
        <div className="md:w-2/3 flex flex-col gap-3">
          <h1 className="text-4xl font-extrabold text-[#4a2c1a] mb-2 font-serif">{book.title}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-2">
            <p className="text-base text-[#5c4033]"><span className="font-semibold">Author:</span> {book.author}</p>
            <p className="text-base text-[#5c4033]"><span className="font-semibold">Category:</span> {book.category?.name || "N/A"} ({book.category?.type || "N/A"})</p>
            <p className="text-base text-[#5c4033]"><span className="font-semibold">Language:</span> {book.language || "N/A"}</p>
            <p className="text-base text-[#5c4033]"><span className="font-semibold">Publisher:</span> {book.publisher || "N/A"}</p>
            <p className="text-base text-[#5c4033]"><span className="font-semibold">Year:</span> {book.year || "N/A"}</p>
            <p className="text-base text-[#5c4033]"><span className="font-semibold">ISBN:</span> {book.isbn || "N/A"}</p>
            <p className="text-base text-[#5c4033]"><span className="font-semibold">Available:</span> {book.available || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-[#e6d5c3] mb-2">
            <p className="text-base text-[#5c4033]"><span className="font-semibold">Description:</span> {book.description || "N/A"}</p>
          </div>
          <p className="mt-2 font-semibold text-yellow-600">⭐️ Average Rating: {book.averageRating.toFixed(1)} ({book.comments.length} reviews)</p>

          <Button 
            className="mt-4 bg-gradient-to-r from-[#563019] to-[#7b4a2f] hover:from-[#7b5e57] hover:to-[#5c4033] text-white shadow-lg font-semibold rounded-full px-6 py-2"
            onClick={handleBorrowDialogOpen} 
            disabled={book.available <= 0}
          >
            {book.available > 0 ? "Borrow this book" : "Currently unavailable"}
          </Button>
          <p className="mt-1 text-sm text-[#a1887f]">
            {book.available > 0 
              ? `${book.available} copies available` 
              : "All copies are currently borrowed"}
          </p>
        </div>
      </div>
      
      {/* Ratings + Comments Section */}
      <div className="max-w-5xl mx-auto mt-8 p-8 bg-gradient-to-br from-[#fffaf3] via-[#fdf0e0] to-[#e6c9a9] shadow-xl rounded-2xl border border-[#e3c1ab]">
        <h2 className="text-2xl font-bold text-[#4a2c1a] mb-4 font-serif">Your Rating</h2>
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(star => (
            <button 
              key={star} 
              className={`text-3xl ${userRating >= star ? "text-yellow-500" : "text-[#e6d5c3]"} hover:scale-110 transition-transform`}
              onClick={() => handleRatingSubmit(star)}
            >
              ★
            </button>
          ))}
        </div>

        {/* Comments Toggle */}
        <button
          className="mb-4 px-4 py-2 bg-gradient-to-r from-[#e6d5c3] to-[#fdf8f3] rounded-full text-[#5c4033] font-semibold shadow hover:from-[#fdf8f3] hover:to-[#e6d5c3]"
          onClick={() => setShowComments((prev) => !prev)}
        >
          {showComments ? "Hide Comments" : `Show Comments (${book.comments.length})`}
        </button>
        
        {showComments && (
          <>
            <h2 className="text-2xl font-bold text-[#4a2c1a] mb-4 font-serif">Comments</h2>
            {book.comments.length > 0 ? (
              <div className="space-y-4">
                {book.comments.map(c => (
                  <div key={c._id} className="border-b border-[#e6d5c3] py-3 flex gap-3 items-start relative">
                    <Avatar className="bg-[#e6d5c3]">
                      {c.user?.profileImage 
                        ? <AvatarImage src={c.user.profileImage} alt={c.user?.fullName || "User"} />
                        : <AvatarFallback>{c.user?.fullName ? c.user.fullName.split(" ").map(n => n[0]).join("") : "U"}</AvatarFallback>
                      }
                    </Avatar>

                    <div className="flex-1">
                      <p className="font-semibold text-[#5c4033]">{c.user?.fullName || "User"}</p>

                      {editingCommentId === c._id ? (
                        <div className="flex gap-2 mt-1">
                          <Textarea 
                            value={editingText} 
                            onChange={e => setEditingText(e.target.value)} 
                            className="flex-1 h-16 border border-[#e6d5c3] rounded" 
                          />
                          <Button onClick={() => handleEditComment(c._id)} className="bg-[#5c4033] text-white">Save</Button>
                          <Button variant="outline" onClick={() => setEditingCommentId(null)} className="border-[#e6d5c3]">Cancel</Button>
                        </div>
                      ) : (
                        <p className="text-[#4a2c1a]">{c.text}</p>
                      )}
                    </div>

                    {/* 3-dot menu (all users see it) */}
                    <div className="relative" ref={menuRef}>
                      <button onClick={() => setOpenMenu(openMenu === c._id ? null : c._id)}>
                        <MoreVertical className="w-5 h-5 text-[#5c4033]" />
                      </button>

                      {openMenu === c._id && (
                        <div className="absolute top-6 right-0 bg-white border border-[#e6d5c3] shadow-md rounded w-32 z-50">
                          {c.user?._id === currentUserId || currentUserRole === "admin" ? (
                            <>
                              {c.user?._id === currentUserId && (
                                <button 
                                  className="block w-full px-4 py-2 text-left hover:bg-[#fdf8f3] text-[#5c4033]"
                                  onClick={() => { 
                                    setEditingCommentId(c._id); 
                                    setEditingText(c.text); 
                                    setOpenMenu(null); 
                                  }}
                                >
                                  Edit
                                </button>
                              )}
                              <button 
                                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-100"
                                onClick={() => handleDeleteComment(c._id)}
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <span className="block px-4 py-2 text-gray-500 cursor-not-allowed">No actions</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </>
        )}

        {/* Add Comment */}
        <div className="mt-6 flex gap-3">
          <Textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) { 
                e.preventDefault(); 
                handleCommentSubmit(); 
              }
            }}
            placeholder="Add a comment..."
            className="flex-1 resize-none h-16 rounded border border-[#e6d5c3] bg-[#fffaf3]"
          />
          <button 
            onClick={handleCommentSubmit} 
            className="bg-gradient-to-r from-[#5c4033] to-[#7b5e57] text-white px-5 py-3 rounded-full shadow hover:from-[#7b5e57] hover:to-[#5c4033] flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;