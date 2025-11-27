import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

import logoImage from "../../assets/images/logo.jpg";

const NavItem = ({ to, icon, children }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center p-3 my-1 rounded-lg transition-colors ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`
    }
  >
    {icon}
    <span className="ml-4 font-medium">{children}</span>
  </NavLink>
);

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay: This darkens the background when the sidebar is open on mobile */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* --- THIS IS THE CORRECTED PART --- */}
      <aside
        className={`fixed inset-y-0 left-0 bg-gray-800 text-white z-40 flex flex-col w-64 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:w-64`}
      >
        {/* Logo */}
        <div className="flex items-center justify-start h-20 px-6 border-b border-gray-700 flex-shrink-0">
          <img src={logoImage} alt="EduLink360 Logo" className="h-10" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          <NavItem to="/" icon={<LayoutDashboard />}>
            Dashboard
          </NavItem>
          <NavItem to="/messages" icon={<MessageSquare />}>
            Messages
          </NavItem>
          <NavItem to="/feedbacks" icon={<FileText />}>
            Feedbacks
          </NavItem>
          <NavItem to="/notifications" icon={<Bell />}>
            Notifications
          </NavItem>
        </nav>

        {/* Bottom Section */}
        <div className="px-4 py-4 border-t border-gray-700">
          <NavItem to="/settings" icon={<Settings />}>
            Settings
          </NavItem>
          <button
            onClick={handleLogout}
            className="flex items-center p-3 my-1 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white w-full"
          >
            <LogOut />
            <span className="ml-4 font-medium">Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
