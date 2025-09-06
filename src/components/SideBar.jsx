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
  Users
} from "lucide-react";
import { useState } from "react";
import FeedbackDialog from "./FeedbackDialog";

const SidebarLink = ({ href, icon: Icon, label, active, collapsed }) => (
  <a
    href={href}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
      active
        ? "bg-[#e6d5c3] text-[#5c4033]"
        : "text-[#7b5e57] hover:bg-[#f3ebe3] hover:text-[#5c4033]"
    }`}
  >
    <Icon className="h-5 w-5 flex-shrink-0" />
    {!collapsed && <span>{label}</span>}
  </a>
);

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const isAdmin = useAuthStore((state) => state.isAdmin());
  
  // Student links (default)
  const mainLinks = [
    { href: "/Dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/AllBooks", icon: Book, label: "All Books" },
    // { href: "/Borrow", icon: BookCopy, label: "Borrow a Book" },
    { href: "/Favorites", icon: Heart, label: "My Shelf" },
    { href: "/ReadingHistory", icon: History, label: "Reading History" },
    { href: "/Membership", icon: BookMarked, label: "Membership" },
    { href: "/Profile", icon: User, label: "Profile" },
  ];
  
  // Admin links
  const adminLinks = [
    { href: "/AdminDashboard", icon: LayoutDashboard, label: "Admin Dashboard" },
    { href: "/ManageBooks", icon: Book, label: "Manage Books" },
    { href: "/ManageUsers", icon: Users, label: "Manage Users" },
    { href: "/BorrowingRequests", icon: BookMarked, label: "Borrowing Requests" },
    { href: "/ManageMemberships", icon: Users, label: "Manage Memberships" },
    { href: "/BorrowHistory", icon: History, label: "Borrow History" },
    { href: "/AdminSettings", icon: Settings, label: "Settings" },
    { href: "/AdminProfile", icon: User, label: "Profile" },
  ];

  const bottomLinks = [
    { href: "/about", icon: Info, label: "About" },
    { href: "/support", icon: LifeBuoy, label: "Support" },
    isAdmin
      ? { href: "/admin-feedback", icon: MessageSquare, label: "View Feedback", isViewFeedback: true }
      : { href: "#feedback", icon: MessageSquare, label: "Feedback", isFeedback: true },
  ];

  const [feedbackOpen, setFeedbackOpen] = useState(false);

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
          <a
            href="/"
            className="flex items-center gap-2 font-semibold"
            style={{ color: "#5c4033" }}
          >
            <Book className="h-6 w-6" />
            <span>ASTUMSJ Library</span>
          </a>
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
              {...item}
              active={window.location.pathname === item.href}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </div>

      {/* About, Support, Feedback */}
      <div className="p-4 border-t" style={{ borderColor: "#e5d6c5" }}>
        {bottomLinks.map((item) =>
          item.isFeedback ? (
            <button
              key={item.label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-[#7b5e57] hover:bg-[#f3ebe3] hover:text-[#5c4033] w-full`}
              onClick={() => setFeedbackOpen(true)}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ) : item.isViewFeedback ? (
            <SidebarLink
              key={item.label}
              {...item}
              active={window.location.pathname === item.href}
              collapsed={collapsed}
            />
          ) : (
            <SidebarLink
              key={item.label}
              {...item}
              active={window.location.pathname === item.href}
              collapsed={collapsed}
            />
          )
        )}
        {!isAdmin && <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />}
      </div>
    </div>
  );
}
