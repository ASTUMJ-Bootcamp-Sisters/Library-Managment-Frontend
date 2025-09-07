
import { Calendar, Clock, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";


export default function Navbar() {
  const [time, setTime] = useState("");
  const [gregDate, setGregDate] = useState("");
  const [hijriDate, setHijriDate] = useState("");
  const [hijriArabic, setHijriArabic] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Time
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

      // Gregorian EN (always in English)
      const greg = now.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      setGregDate(greg);

      // Hijri
      const hijri = hijriArabic
        ? new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(now)
        : new Intl.DateTimeFormat("en-US-u-ca-islamic", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(now);
      setHijriDate(hijri);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, [hijriArabic]);

  return (
    <nav className="bg-white p-2 rounded-xl shadow-md w-full">
      <div className="flex items-center justify-between">
        {/* Left: Dates and Toggle */}
        <div className="flex items-center space-x-2">
          {/* Hamburger for mobile */}
          <button className="md:hidden mr-2" onClick={() => setMobileMenu(!mobileMenu)}>
            <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-700"></span>
          </button>
          {/* Gregorian Date */}
          <div className="hidden md:flex items-center space-x-1 bg-[#fdf8f3] p-2 rounded-full border border-[#e6d5c3]">
            <Calendar size={18} className="text-red-500" />
            <span className="text-sm">{gregDate}</span>
          </div>
          {/* Hijri Date */}
          <div className="hidden md:flex items-center space-x-1 bg-[#fff0e0] p-2 rounded-full border border-[#e6d5c3]">
            <Calendar size={18} className="text-red-500" />
            <span className="text-sm">{hijriDate}</span>
          </div>
          {/* Toggle Button (Hijri only) */}
          <button
            onClick={() => setHijriArabic(!hijriArabic)}
            className="ml-2 px-2 py-1 text-sm rounded bg-[#5c4033] text-white hover:bg-[#e6d5c3]"
          >
            {hijriArabic ? "EN" : "AR"}
          </button>
        </div>
        
        {/* Right: Time and Avatar */}
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center space-x-1 bg-gray-100 p-2 rounded-full">
            <Clock size={18} className="text-red-500" />
            <span className="text-sm">{time}</span>
          </div>
          {/* Avatar/User Dropdown */}
          <div className="relative">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              {isAuthenticated && user ? (
                <span className="flex items-center gap-2">
                  <User size={28} className="rounded-full border p-1" />
                  <span className="hidden md:inline text-sm font-medium">{user.fullName || user.name || user.email}</span>
                </span>
              ) : (
                <User size={28} className="rounded-full border p-1" />
              )}
            </div>
            {open && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-50">
                {isAuthenticated ? (
                  <button
                    onClick={async () => {
                      await logout();
                      setOpen(false);
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile menu: show dates, search, time */}
      {mobileMenu && (
        <div className="md:hidden mt-2 space-y-2">
          <div className="flex items-center space-x-1 bg-[#fdf8f3] p-2 rounded-full border border-[#e6d5c3]">
            <Calendar size={18} className="text-red-500" />
            <span className="text-sm">{gregDate}</span>
          </div>
          <div className="flex items-center space-x-1 bg-[#fff0e0] p-2 rounded-full border border-[#e6d5c3]">
            <Calendar size={18} className="text-red-500" />
            <span className="text-sm">{hijriDate}</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-full">
            <span className="text-gray-500">All</span>
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-sm"
            />
            <Search size={18} className="text-red-500" />
          </div>
          <div className="flex items-center space-x-1 bg-gray-100 p-2 rounded-full">
            <Clock size={18} className="text-red-500" />
            <span className="text-sm">{time}</span>
          </div>
        </div>
      )}
    </nav>
  );
}
