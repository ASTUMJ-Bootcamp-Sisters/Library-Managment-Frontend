import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import api from "../api/auth";

export default function FeedbackDialog({ open, onOpenChange }) {
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
      onOpenChange(false);
    } catch (err) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to submit feedback.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#4a2c1a] hover:bg-[#633b25]">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
