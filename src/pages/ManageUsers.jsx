import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import useUserStore from "../store/useUserStore";

const ManageUsers = () => {
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const { users, loading, error, fetchUsers, toggleBlacklist } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = roleFilter === "all" ? users : users.filter(u => u.role === roleFilter);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleUserClick = async (userId) => {
    try {
      const response = await axios.get(`/api/auth/users/${userId}`);
      navigate(`/user-detail/${userId}`, { state: { user: response.data.user } });
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <div className="mb-2 flex items-center gap-2">
        <label htmlFor="roleFilter" className="font-medium">Filter by role:</label>
        <select
          id="roleFilter"
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="border rounded px-2 py-1 w-[180px]"
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
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Blacklisted</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <span
                        className="text-blue-600 cursor-pointer hover:underline"
                        onClick={() => handleUserClick(user._id)}
                      >
                        {user.fullName || user.name}
                      </span>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <select
                        value={user.role}
                        onChange={e => useUserStore.getState().assignRole(user._id, e.target.value)}
                        disabled={user.isBlacklisted}
                        className="border rounded px-2 py-1"
                      >
                        {user.role === "admin" ? (
                          <>
                            <option value="admin">admin</option>
                            <option value="user">student</option>
                          </>
                        ) : (
                          <>
                            <option value="user">student</option>
                            <option value="admin">admin</option>
                          </>
                        )}
                      </select>
                    </TableCell>
                    <TableCell>{user.isBlacklisted ? "Yes" : "No"}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        className={`px-3 py-1 rounded text-white ${user.isBlacklisted ? "bg-green-600" : "bg-red-600"}`}
                        onClick={() => toggleBlacklist(user._id, user.isBlacklisted)}
                      >
                        {user.isBlacklisted ? "Unblacklist" : "Blacklist"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination */}
            <div className="flex justify-center mt-4">
              {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? "bg-[#5c4033] text-white" : "bg-[#d2b48c] text-black"}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ManageUsers;
