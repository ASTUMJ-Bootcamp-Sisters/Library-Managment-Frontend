import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is not admin, redirect to student dashboard
    if (isAdmin && !isAdmin()) {
      navigate("/Dashboard");
    }
  }, [isAdmin, navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#5c4033] mb-4">Admin Dashboard</h1>
      <div className="bg-[#fdf8f3] p-4 rounded-lg shadow border border-[#e5d6c5]">
        <h2 className="text-lg font-medium text-[#5c4033]">Welcome back, {user?.fullName || 'Admin'}</h2>
        <p className="text-[#7b5e57] mt-2">Manage books, users, and borrowing requests.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="bg-[#fdf8f3] p-4 rounded-lg shadow border border-[#e5d6c5]">
          <h3 className="font-medium text-[#5c4033]">Books</h3>
          <p className="text-2xl font-bold text-[#5c4033]">0</p>
          <p className="text-sm text-[#7b5e57]">Total books in library</p>
        </div>
        
        <div className="bg-[#fdf8f3] p-4 rounded-lg shadow border border-[#e5d6c5]">
          <h3 className="font-medium text-[#5c4033]">Users</h3>
          <p className="text-2xl font-bold text-[#5c4033]">0</p>
          <p className="text-sm text-[#7b5e57]">Registered users</p>
        </div>
        
        <div className="bg-[#fdf8f3] p-4 rounded-lg shadow border border-[#e5d6c5]">
          <h3 className="font-medium text-[#5c4033]">Borrowed</h3>
          <p className="text-2xl font-bold text-[#5c4033]">0</p>
          <p className="text-sm text-[#7b5e57]">Books currently borrowed</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
