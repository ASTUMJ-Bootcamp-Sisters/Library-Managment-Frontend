import { ArrowLeft, Send, MoreVertical, User, Tag, Globe, BookOpen, Calendar, Hash, CheckCircle } from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
import { addComment, getBookById, rateBook, editComment, deleteComment } from "@/api/bookApi";
import { borrowBook } from "@/api/borrowApi";
import axios from "axios";

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

  const menuRef = useRef(null);

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
    } catch (err) {
      console.error("Error fetching book:", err);
      toast({ title: "Error", description: "Failed to load book details", variant: "destructive" });
    }
  }, [id, toast, currentUserId]);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await fetchCurrentUser();
      await fetchBook();
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
      toast({ title: "Error", description: "Comment cannot be empty", variant: "destructive" });
      return;
    }
    await editComment(commentId, editingText.trim());
    setEditingCommentId(null);
    setEditingText("");
    setOpenMenu(null);
    fetchBook();
    toast({ title: "Success", description: "Comment updated" });
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId); 
      setBook((prev) => ({
        ...prev,
        comments: prev.comments.filter(c => c._id !== commentId)
      }));
      setOpenMenu(null);
      toast({ title: "Success", description: "Comment deleted" });
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast({ title: "Error", description: "Failed to delete comment", variant: "destructive" });
    }
  };

  const handleRatingSubmit = async (value) => {
    setUserRating(value);
    try {
      await rateBook(id, { value });
      fetchBook();
    } catch (err) {
      console.error("Error submitting rating:", err);
      toast({ title: "Error", description: "Failed to submit rating", variant: "destructive" });
    }
  };

  const handleBorrowDialogOpen = () => {
    if (book.available <= 0) {
      toast({ title: "Book unavailable", description: "This book is currently out of stock", variant: "destructive" });
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
        toast({ title: "Missing files", description: "Upload ID card and payment proof", variant: "destructive" });
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
      toast({ title: "Success", description: "Borrow request submitted" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to borrow book", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-[#fdf8f3] p-6">
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
                  <RadioGroupItem value="1w" id="1w" /><Label htmlFor="1w">1 Week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2w" id="2w" /><Label htmlFor="2w">2 Weeks</Label>
                </div>
              </RadioGroup>
            </div>
            {userMembership?.status !== "Active" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="idCard">ID Card Image (Required)</Label>
                  <input type="file" id="idCard" accept="image/*" onChange={(e)=>handleFileChange(e,setIdCardImage)} className="w-full border rounded p-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment">Payment Screenshot (Required)</Label>
                  <input type="file" id="payment" accept="image/*" onChange={(e)=>handleFileChange(e,setPaymentImage)} className="w-full border rounded p-2" />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="note">Notes (Optional)</Label>
              <Textarea id="note" value={borrowNote} onChange={(e)=>setBorrowNote(e.target.value)} className="w-full" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={()=>setBorrowDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#4f2e19] hover:bg-[#724228] text-white " disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Borrow"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Book Details Section */}
      <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-6">
        {/* Book Image */}
        <div className="md:w-1/3 flex justify-center items-start">
          <img src={book.image} alt={book.title} className="w-full h-auto max-h-[500px] object-contain rounded-lg border border-gray-200 shadow-lg" />
        </div>

        {/* Book Info */}
        <div className="md:w-2/3 flex flex-col gap-3 p-6 rounded-lg shadow-lg"
             style={{ background: "linear-gradient(to bottom right, #fdf8f3, #f3ebe3)", border: "1px solid #e5d6c5" }}>
          <h1 className="text-4xl font-extrabold text-[#5c4033]">{book.title}</h1>

          <p className="text-lg text-[#7b5e57] flex items-center gap-2">
            <User className="w-5 h-5 text-[#5c4033]" /> <strong>Author:</strong> {book.author}
          </p>
          <p className="text-lg text-[#7b5e57] flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#5c4033]" /> <strong>Category:</strong> {book.category?.name || "N/A"} ({book.category?.type || "N/A"})
          </p>
          <p className="text-lg text-[#7b5e57] flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#5c4033]" /> <strong>Language:</strong> {book.language || "N/A"}
          </p>
          <p className="text-lg text-[#7b5e57] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#5c4033]" /> <strong>Publisher:</strong> {book.publisher || "N/A"}
          </p>
          <p className="text-lg text-[#7b5e57] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#5c4033]" /> <strong>Year:</strong> {book.year || "N/A"}
          </p>
          <p className="text-lg text-[#7b5e57] flex items-center gap-2">
            <Hash className="w-5 h-5 text-[#5c4033]" /> <strong>ISBN:</strong> {book.isbn || "N/A"}
          </p>
          <p className="text-lg text-[#7b5e57] flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#5c4033]" /> <strong>Available:</strong> {book.available || 0}
          </p>

          <p className="text-lg text-[#7b5e57] mt-2"><strong>Description:</strong> {book.description || "N/A"}</p>

          <p className="mt-2 font-semibold text-yellow-600">⭐ Average Rating: {book.averageRating.toFixed(1)} ({book.comments.length} reviews)</p>

          <Button className="mt-4 bg-[#563019] hover:bg-[#7b4a2f] text-white" onClick={handleBorrowDialogOpen} disabled={book.available<=0}>
            {book.available>0 ? "Borrow this book" : "Currently unavailable"}
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="max-w-6xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-[#5c4033] mb-4">Your Rating</h2>
        <div className="flex items-center gap-2 mb-6">
          {[1,2,3,4,5].map(star => (
            <button key={star} className={`text-3xl ${userRating>=star?"text-yellow-500":"text-gray-300"}`} onClick={()=>handleRatingSubmit(star)}>★</button>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-[#5c4033] mb-4">Comments</h2>
        {book.comments.map(c => (
          <div key={c._id} className="border-b py-3 flex gap-3 items-start relative">
            <Avatar className="bg-slate-400">
              {c.user?.profileImage 
                ? <AvatarImage src={c.user.profileImage} alt={c.user?.fullName||"User"} />
                : <AvatarFallback>{c.user?.fullName ? c.user.fullName.split(" ").map(n=>n[0]).join(""):"U"}</AvatarFallback>}
            </Avatar>

            <div className="flex-1">
              <p className="font-semibold text-gray-800">{c.user?.fullName || "User"}</p>

              {editingCommentId === c._id ? (
                <div className="flex gap-2 mt-1">
                  <Textarea 
                    value={editingText} 
                    onChange={e => setEditingText(e.target.value)} 
                    className="flex-1 h-16" 
                  />
                  <Button onClick={() => handleEditComment(c._id)}>Save</Button>
                  <Button variant="outline" onClick={() => setEditingCommentId(null)}>Cancel</Button>
                </div>
              ) : (
                <p className="text-gray-700">{c.text}</p>
              )}
            </div>

            <div className="relative">
              <button onClick={() => setOpenMenu(openMenu === c._id ? null : c._id)}>
                <MoreVertical className="w-5 h-5" />
              </button>

              {openMenu === c._id && (
                <div className="absolute top-6 right-0 bg-white border shadow-md rounded w-32 z-50">
                  {c.user?._id === currentUserId || currentUserRole === "admin" ? (
                    <>
                      {c.user?._id === currentUserId && (
                        <button 
                        className="block w-full px-4 py-2 text-left hover:bg-gray-300"
                        onClick={() => { setEditingCommentId(c._id); setEditingText(c.text); setOpenMenu(null); }}
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

        <div className="mt-6 flex gap-3">
          <Textarea
            value={newComment}
            onChange={e=>setNewComment(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); handleCommentSubmit(); }}}
            placeholder="Add a comment..."
            className="flex-1 resize-none h-16 rounded border border-gray-300"
          />
          <Button onClick={handleCommentSubmit}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
