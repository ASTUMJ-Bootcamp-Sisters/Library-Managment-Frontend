// AppRoutes.jsx
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

import AllBooks from "./pages/AllBooks";
import Borrow from "./pages/Borrow";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ReadingHistory from "./pages/ReadingHistory";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Welcome page without Layout */}
      <Route path="/" element={<Welcome />} />

      {/* Routes wrapped in Layout */}
      <Route element={<Layout />}>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/AllBooks" element={<AllBooks />} />
        <Route path="/Borrow" element={<Borrow />} />
        <Route path="/Favorites" element={<Favorites />} />
        <Route path="/ReadingHistory" element={<ReadingHistory />} />
        <Route path="/Profile" element={<Profile />} />
      </Route>

      {/* Routes without Layout */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
