import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
// Removed Radix UI Select imports
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
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
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
                          <option value="admin">admin</option>
                          <option value="student">student</option>
                        </>
                      ) : (
                        <>
                          <option value="student">student</option>
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
        )}
      </Card>
    </div>
  );
};

export default ManageUsers;
