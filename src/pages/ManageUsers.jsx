
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Card } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import useAuthStore from "../store/authStore";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(""); // userId for which action is loading
  const token = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/auth/users");
        setUsers(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  // Blacklist/Unblacklist user
  const handleBlacklist = async (userId, isBlacklisted) => {
    setActionLoading(userId);
    try {
      const res = await api.put(`/auth/users/${userId}/blacklist`, { isBlacklisted: !isBlacklisted });
      console.log("Blacklist API response:", res.data);
      // Update the user in-place for instant UI feedback
      setUsers(prevUsers => prevUsers.map(u =>
        u._id === userId ? { ...u, isBlacklisted: res.data.user.isBlacklisted } : u
      ));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update blacklist status");
    } finally {
      setActionLoading("");
    }
  };

  // Filter users by role
  const filteredUsers = roleFilter === "all" ? users : users.filter(u => u.role === roleFilter);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <div className="mb-2 flex items-center gap-2">
        <label htmlFor="roleFilter" className="font-medium">Filter by role:</label>
        <select
          id="roleFilter"
          className="border rounded px-2 py-1"
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="student">Student</option>
        </select>
      </div>
      <Card className="overflow-x-auto overflow-y-auto max-h-[60vh] min-w-[700px]">
        {loading ? (
          <div className="p-4">Loading users...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Blacklisted</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="max-w-[180px] truncate">{user._id}</TableCell>
                  <TableCell>{user.fullName || user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.isBlacklisted ? "Yes" : "No"}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <button
                      className={`px-3 py-1 rounded text-white ${user.isBlacklisted ? "bg-green-600" : "bg-red-600"} disabled:opacity-50`}
                      disabled={actionLoading === user._id}
                      onClick={() => handleBlacklist(user._id, user.isBlacklisted)}
                    >
                      {actionLoading === user._id
                        ? "..."
                        : user.isBlacklisted ? "Unblacklist" : "Blacklist"}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default ManageUsers;
