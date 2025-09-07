import useAuthStore from "@/store/authStore";
import {
  Book,
  BookMarked,
  ChevronLeft,
  ChevronRight,
  Heart,
  History,
  Info,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import FeedbackDialog from "./FeedbackDialog";

// Sidebar link component
const SidebarLink = ({ to, label, icon: Icon, active, collapsed }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
      active
        ? "bg-[#e6d5c3] text-[#5c4033]"
        : "text-[#7b5e57] hover:bg-[#f3ebe3] hover:text-[#5c4033]"
    }`}
  >
    {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
    {!collapsed && <span>{label}</span>}
  </Link>
);

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const isAdmin = useAuthStore((state) => state.isAdmin());
  const location = useLocation(); // For active link detection

  // Student links
  const mainLinks = [
    { to: "/Dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/AllBooks", icon: Book, label: "All Books" },
    { to: "/Favorites", icon: Heart, label: "My Shelf" },
    { to: "/ReadingHistory", icon: History, label: "Reading History" },
    { to: "/Membership", icon: BookMarked, label: "Membership" },
    { to: "/Profile", icon: User, label: "Profile" },
  ];

  // Admin links
  const adminLinks = [
    { to: "/AdminDashboard", icon: LayoutDashboard, label: "Admin Dashboard" },
    { to: "/ManageBooks", icon: Book, label: "Manage Books" },
    { to: "/ManageUsers", icon: Users, label: "Manage Users" },
    { to: "/BorrowingRequests", icon: BookMarked, label: "Borrowing Requests" },
    { to: "/admin-book-reviews", icon: BookMarked, label: "Book Review Events" },
    { to: "/ManageMemberships", icon: Users, label: "Manage Memberships" },
    { to: "/BorrowHistory", icon: History, label: "Borrow History" },
    { to: "/AdminSettings", icon: Settings, label: "Settings" },
    { to: "/AdminProfile", icon: User, label: "Profile" },
  ];

  // Bottom links
  const bottomLinks = [
    { to: "/about", icon: Info, label: "About" },
    { to: "/support", icon: LifeBuoy, label: "Support" },
    isAdmin
      ? { to: "/admin-feedback", icon: MessageSquare, label: "View Feedback", isViewFeedback: true }
      : { to: "#feedback", icon: MessageSquare, label: "Feedback", isFeedback: true },
  ];

  return (
    <div
      className="flex flex-col h-screen border-r transition-all duration-300"
      style={{
        width: collapsed ? "80px" : "250px",
        backgroundColor: "#fdf8f3",
        borderColor: "#e5d6c5",
      }}
    >
      {/* Header with Collapse Toggle */}
      <div
        className="flex items-center justify-between h-14 border-b px-3"
        style={{ borderColor: "#e5d6c5" }}
      >
        {!collapsed && (
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold"
            style={{ color: "#5c4033" }}
          >
            <Book className="h-6 w-6" />
            <span>ASTUMSJ Library</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 text-[#7b5e57]"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium py-4">
          {(isAdmin ? adminLinks : mainLinks).map((item) => (
            <SidebarLink
              key={item.label}
              to={item.to}
              label={item.label}
              icon={item.icon}
              active={location.pathname === item.to}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Links */}
      <div className="p-4 border-t" style={{ borderColor: "#e5d6c5" }}>
        {bottomLinks.map((item) =>
          item.isFeedback ? (
            <button
              key={item.label}
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-[#7b5e57] hover:bg-[#f3ebe3] hover:text-[#5c4033] w-full"
              onClick={() => setFeedbackOpen(true)}
            >
              {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
              {!collapsed && <span>{item.label}</span>}
            </button>
          ) : (
            <SidebarLink
              key={item.label}
              to={item.to}
              label={item.label}
              icon={item.icon}
              active={location.pathname === item.to}
              collapsed={collapsed}
            />
          )
        )}
        {!isAdmin && <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />}
      </div>
    </div>
  );
}
