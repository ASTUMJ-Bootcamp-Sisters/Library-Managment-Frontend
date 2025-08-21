import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  return (
    <div>
      <h1>Student Dashboard</h1>
      <p>Welcome to your dashboard!</p>

      <nav className="flex gap-4 mt-4">
        <Link to="/login" className="text-blue-500 underline">
          Login
        </Link>
        <Link to="/signup" className="text-blue-500 underline">
          Sign Up
        </Link>
      </nav>
    </div>
  );
};

export default StudentDashboard;
