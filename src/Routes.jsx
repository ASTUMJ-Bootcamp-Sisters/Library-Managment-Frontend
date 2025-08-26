// AppRoutes.jsx
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';

import AllBooks from './pages/AllBooks';
import Borrow from './pages/Borrow';
import Favorites from './pages/Favorites';
import Login from './pages/login';
import Profile from './pages/Profile';
import ReadingHistory from './pages/ReadingHistory';
import SignUp from './pages/SignUp';
import StudentDashboard from './pages/StudentDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes wrapped in Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<StudentDashboard />} />
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
