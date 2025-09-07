import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from '../api/axios';
import { Card } from "../components/ui/card";

const UserDetail = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(location.state?.user || null);

  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        try {
          const response = await api.get(`/auth/users/${userId}`);
          console.log("Fetched user data:", response.data.user); // Debugging log
          setUser(response.data.user);
        } catch (err) {
          console.error("Error fetching user details:", err);
        }
      };
      fetchUser();
    }
  }, [user, userId]);

  if (!user) {
    return <div className="p-4">Loading user details...</div>;
  }

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-[#8B4513] text-white rounded hover:bg-[#5C3317]"
      >
        Back to Manage Users
      </button>
      <h2 className="text-2xl font-bold mb-4">User Details</h2>
      <Card className="p-4 border border-[#8B4513] bg-[#F5DEB3] rounded">
        <p>
          <strong>Name:</strong> {user.fullName || user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Blacklisted:</strong> {user.isBlacklisted ? "Yes" : "No"}
        </p>
        <p>
          <strong>Email Verified:</strong> {user.emailVerified ? "Yes" : "No"}
        </p>
        <p>
          <strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleString()}
        </p>
        <p>
          <strong>Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}
        </p>
        
      </Card>
    </div>
  );
};

export default UserDetail;
