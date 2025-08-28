 
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is admin, redirect to admin dashboard
    if (isAdmin && isAdmin()) {
      navigate("/AdminDashboard");
    }
  }, [isAdmin, navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#5c4033] mb-4">Student Dashboard</h1>
      <div className="bg-[#fdf8f3] p-4 rounded-lg shadow border border-[#e5d6c5]">
        <h2 className="text-lg font-medium text-[#5c4033]">Welcome back, {user?.fullName || 'Student'}</h2>
        <p className="text-[#7b5e57] mt-2">Browse books, manage your borrowings, and discover new reads.</p>
      </div>
    </div>
  );
};

export default Dashboard;
