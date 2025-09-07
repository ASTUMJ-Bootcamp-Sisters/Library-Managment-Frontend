import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import api from "../api/auth";

import { MessageCircle } from "lucide-react";

export default function FeedbackDialog() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({ title: "Required", description: "Feedback message cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/feedback", { message });
      toast({ title: "Thank you!", description: "Your feedback was submitted.", variant: "default" });
      setMessage("");
      setOpen(false);
    } catch (err) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to submit feedback.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        className="fixed bottom-8 right-8 z-50 bg-[#5c4033] hover:bg-[#7b5e57] text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
        onClick={() => setOpen(true)}
        aria-label="Send Feedback"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Share your thoughts, suggestions, or issues..."
              className="w-full min-h-[100px]"
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#5c4033] hover:bg-[#633b25] text-white">
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
