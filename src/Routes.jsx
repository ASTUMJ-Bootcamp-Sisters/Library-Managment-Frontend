// AppRoutes.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import useAuthStore from "./store/authStore";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import AdminSettings from "./pages/AdminSettings";
import AllBooks from "./pages/AllBooks";
import Borrow from "./pages/Borrow";
import BorrowingRequests from "./pages/BorrowingRequests";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import ManageBooks from "./pages/ManageBooks";
import ManageUsers from "./pages/ManageUsers";
import Profile from "./pages/Profile";
import ReadingHistory from "./pages/ReadingHistory";
import SignUp from "./pages/SignUp";
import Welcome from "./pages/Welcome";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Admin route component
const AdminRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== "admin" && role !== "super-admin")
    return <Navigate to="/Dashboard" replace />;
  return children;
};

const AppRoutes = () => {
  const userRole = useAuthStore((state) => state.user?.role);

  return (
    <Routes>
      {/* Public welcome page */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Routes wrapped in Layout */}
      <Route element={<Layout />}>
        {/* Student / general routes */}
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AllBooks"
          element={
            <ProtectedRoute>
              <AllBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Borrow"
          element={
            <ProtectedRoute>
              <Borrow />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ReadingHistory"
          element={
            <ProtectedRoute>
              <ReadingHistory />
            </ProtectedRoute>
          }
        />

        {/* Dynamic profile route */}
        <Route
          path="/AdminProfile"
          element={
            <ProtectedRoute>
              {userRole === "admin" || userRole === "super-admin" ? (
                <AdminProfile />
              ) : (
                <Profile />
              )}
            </ProtectedRoute>
          }
        />
        <Route
  path="/Profile"
  element={
    <ProtectedRoute>
      {userRole === "admin" || userRole === "super-admin" ? <AdminProfile /> : <Profile />}
    </ProtectedRoute>
  }
/>


        {/* Admin-only routes */}
        <Route
          path="/AdminDashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/ManageBooks"
          element={
            <AdminRoute>
              <ManageBooks />
            </AdminRoute>
          }
        />
        <Route
          path="/ManageUsers"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/BorrowingRequests"
          element={
            <AdminRoute>
              <BorrowingRequests />
            </AdminRoute>
          }
        />
        
        <Route
          path="/AdminSettings"
          element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
