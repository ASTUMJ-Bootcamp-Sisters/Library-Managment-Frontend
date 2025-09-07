import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import useUserStore from "../store/useUserStore";

const ManageUsers = () => {
  const [roleFilter, setRoleFilter] = useState("all");
  const { users, loading, error, fetchUsers, toggleBlacklist } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = roleFilter === "all" ? users : users.filter(u => u.role === roleFilter);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#fdf9f5] via-[#f9ebdb] to-[#fdebde]">
      <h2 className="text-2xl font-bold text-[#5c4033] mb-6">Manage Users</h2>

      {/* Filter */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="roleFilter" className="font-medium text-[#5c4033]">Filter by role:</label>
          <select
            id="roleFilter"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="border rounded px-2 py-1 shadow-sm hover:border-[#5c4033] transition"
          >
            <option value="all">All</option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-x-auto overflow-y-auto max-h-[60vh] shadow-lg rounded-lg bg-white">
        {loading ? (
          <div className="p-4 text-[#5c4033]">Loading users...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader className="bg-[#f7f2ec] sticky top-0 z-10">
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
              {filteredUsers.map((user) => (
                <TableRow 
                  key={user._id} 
                  className="text-center cursor-pointer hover:bg-[#f9f6f3] transition"
                >
                  <TableCell>{user.fullName || user.name}</TableCell>
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
                          <option value="admin">Admin</option>
                          <option value="user">Student</option>
                        </>
                      ) : (
                        <>
                          <option value="user">Student</option>
                          <option value="admin">Admin</option>
                        </>
                      )}
                    </select>
                  </TableCell>
                  <TableCell>{user.isBlacklisted ? "Yes" : "No"}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      className={`px-3 py-1 rounded text-white ${user.isBlacklisted ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} transition`}
                      onClick={() => toggleBlacklist(user._id, user.isBlacklisted)}
                    >
                      {user.isBlacklisted ? "Unblacklist" : "Blacklist"}
                    </Button>
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
