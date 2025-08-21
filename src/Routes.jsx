
import { Route, Routes } from 'react-router-dom';

import Login from './pages/login';
import SignUp from './pages/SignUp';
import StudentDashboard from './pages/StudentDashboard';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentDashboard />} />
      
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;