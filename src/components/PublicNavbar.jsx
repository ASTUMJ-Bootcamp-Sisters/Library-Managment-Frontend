// src/components/Navbar.js

import { BookOpen } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const PublicNavbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-md px-4 sm:px-6 py-3">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-[#5c4033]" />
          <span className="text-xl font-bold text-[#4a2c1a] tracking-wider hidden sm:block">
            ASTUMSJ Library
          </span>
        </Link>

        {/* Login Button */}
        <Link to="/login">
          <button className="bg-[#5c4033] text-white font-semibold px-6 py-2 rounded-full hover:bg-[#7b5e57] transition-colors duration-300 shadow-sm">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default PublicNavbar;