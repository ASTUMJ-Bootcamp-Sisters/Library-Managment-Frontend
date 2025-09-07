import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AdminBookReview from "./pages/AdminBookReview";
import useAuthStore from "./store/authStore";

import AdminDashboard from "./pages/AdminDashboard";
import AdminFeedback from "./pages/AdminFeedback";
import AdminProfile from "./pages/AdminProfile";
import AdminSettings from "./pages/AdminSettings";
import AllBooks from "./pages/AllBooks";
import BookDetail from "./pages/BookDetail";
import Borrow from "./pages/Borrow";
import BorrowHistory from "./pages/BorrowHistory";
import BorrowingRequests from "./pages/BorrowingRequests";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import Login from "./pages/login";
import ManageBooks from "./pages/ManageBooks";
import ManageMemberships from "./pages/ManageMemberships";
import ManageUsers from "./pages/ManageUsers";
import Membership from "./pages/Membership";
import Profile from "./pages/Profile";
import ReadingHistory from "./pages/ReadingHistory";
import SignUp from "./pages/SignUp";
import UserDetail from "./pages/UserDetail"; // ✅ new page import
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
  // ✅ fix userRole
  const userRole = useAuthStore((state) => state.user?.role);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Routes wrapped in Layout */}
      <Route element={<Layout />}>
        {/* General user routes */}
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
          path="/book/:id"
          element={
            <ProtectedRoute>
              <BookDetail />
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
        <Route
          path="/Membership"
          element={
            <ProtectedRoute>
              <Membership />
            </ProtectedRoute>
          }
        />

        {/* Profile routes (dynamic based on role) */}
        <Route
          path="/Profile"
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

        {/* ✅ User Detail page */}
        <Route
          path="/user-detail/:userId"
          element={
            <ProtectedRoute>
              <UserDetail />
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
          path="/BorrowHistory"
          element={
            <AdminRoute>
              <BorrowHistory />
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
        <Route
          path="/AdminProfile"
          element={
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-book-reviews"
          element={
            <AdminRoute>
              <AdminBookReview />
            </AdminRoute>
          }
        />
        <Route
          path="/ManageMemberships"
          element={
            <AdminRoute>
              <ManageMemberships />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-feedback"
          element={
            <AdminRoute>
              <AdminFeedback />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
