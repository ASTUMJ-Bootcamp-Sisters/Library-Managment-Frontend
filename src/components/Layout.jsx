import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./NavBar";
import Sidebar from "./SideBar";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 h-screen">
        <Navbar />
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet /> {/* <-- Renders the current route */}
        </main>
        <Footer />
      </div>
      
    </div>
  );
}
