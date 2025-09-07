import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import api from "../api/auth";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await api.get("/feedback");
        setFeedbacks(Array.isArray(res.data) ? res.data : []);
      } catch {
        toast({ title: "Error", description: "Failed to load feedback.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="min-h-screen bg-[#fffaf3] p-6">
      <h1 className="text-3xl font-bold text-[#4a2c1a] mb-6">User Feedback</h1>
      {loading ? (
        <p>Loading...</p>
      ) : feedbacks.length === 0 ? (
        <p className="text-gray-500">No feedback submitted yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map(fb => (
            <Card key={fb._id} className="p-4 flex gap-3 items-start">
              <Avatar className="bg-slate-400">
                {fb.user?.profileImage ? (
                  <AvatarImage src={fb.user.profileImage} alt={fb.user?.fullName || "User"} />
                ) : (
                  <AvatarFallback>
                    {fb.user?.fullName ? fb.user.fullName.split(" ").map(n => n[0]).join("") : "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{fb.user?.fullName || "User"}</p>
                <p className="text-gray-700 text-sm mb-2">{fb.user?.email}</p>
                <p className="text-gray-900">{fb.message}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(fb.createdAt).toLocaleString()}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
