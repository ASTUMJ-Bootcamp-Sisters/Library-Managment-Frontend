import React from "react";
import { Link } from "react-router-dom";

const phrases = [
  "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
  "اقْرَأْ",
];

const StudentDashboard = () => {
  return (
    <div className="relative min-h-screen">
      <img
        src="/well.png"
        alt="Islamic Book"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 text-center text-white">
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          {phrases.map((text, idx) => (
            <h1 key={idx} className="text-6xl font-extrabold mb-4">
              {text}
            </h1>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen bg-black/20 p-6">
          <h2 className="text-3xl font-semibold mb-2">Welcome to ASTUMSJ Library</h2>
          <nav className="flex gap-4 mt-4">
            <Link to="/login" className="text-blue-200 underline text-lg">
              Login
            </Link>
            <Link to="/signup" className="text-blue-200 underline text-lg">
              Sign Up
            </Link>
            <Link to="/Dashboard" className="text-blue-200 underline text-lg">
              <button > Dashboard</button>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
