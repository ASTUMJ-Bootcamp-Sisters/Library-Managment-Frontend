// AppRoutes.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import useAuthStore from "./store/AuthStore";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import AdminSettings from "./pages/AdminSettings";
import AllBooks from "./pages/AllBooks";
import BookDetail from "./pages/BookDetail"; 
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
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin route component
const AdminRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin());
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/Dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Welcome page without Layout */}
      <Route path="/" element={<Welcome />} />

      {/* Routes wrapped in Layout with auth protection */}
      <Route element={<Layout />}>
        <Route path="/Dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/AllBooks" element={
          <ProtectedRoute>
            <AllBooks />
          </ProtectedRoute>
        } />
        <Route path="/book/:id" element={
          <ProtectedRoute>
            <BookDetail />
          </ProtectedRoute>
        } />

        <Route path="/Borrow" element={
          <ProtectedRoute>
            <Borrow />
          </ProtectedRoute>
        } />
        <Route path="/Favorites" element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        } />
        <Route path="/ReadingHistory" element={
          <ProtectedRoute>
            <ReadingHistory />
          </ProtectedRoute>
        } />
        <Route path="/Profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        {/* Admin dashboard and admin-only routes */}
        <Route path="/AdminDashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/ManageBooks" element={
          <AdminRoute>
            <ManageBooks />
          </AdminRoute>
        } />
        <Route path="/ManageUsers" element={
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        } />
        <Route path="/BorrowingRequests" element={
          <AdminRoute>
            <BorrowingRequests />
          </AdminRoute>
        } />
        <Route path="/AdminSettings" element={
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        } />
        <Route path="/AdminProfile" element={
          <AdminRoute>
            <AdminProfile />
          </AdminRoute>
        } />
      </Route>

      {/* Routes without Layout */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
