import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Bell,
  Settings,
  LogOut,
  Briefcase,
  FolderOpen,
} from "lucide-react";
import logoImage from "../../assets/images/logo.jpg";
import LogoutModal from "../common/LogoutModal";

const studentNavLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/assignments", label: "Assignments", icon: FileText },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/portfolio", label: "Portfolio", icon: FolderOpen },
  { to: "/career", label: "Career Guidance", icon: Briefcase },
];

const teacherNavLinks = [
  { to: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/teacher/messages", label: "Messages", icon: MessageSquare },
  { to: "/teacher/notifications", label: "Notifications", icon: Bell },
  {
    to: "/teacher/upskilling",
    label: "Professional Development",
    icon: Briefcase,
  },
];

const NavItem = ({ to, icon: Icon, children }) => (
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
    <Icon />
    <span className="ml-4 font-medium">{children}</span>
  </NavLink>
);

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const inferredRole = location.pathname.startsWith("/teacher")
    ? "TEACHER"
    : "STUDENT";
  const role =
    (user?.role && user.role.toUpperCase()) || inferredRole;

  const navLinks = role === "TEACHER" ? teacherNavLinks : studentNavLinks;
  const settingsPath = role === "TEACHER" ? "/teacher/settings" : "/settings";

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate("/login");
    setShowLogoutModal(false);
  };

  return (
    <>
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 bg-gray-800 text-white z-40 flex flex-col w-64 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:w-64`}
      >
        <div className="flex items-center justify-start h-20 px-6 border-b border-gray-700 flex-shrink-0">
          <img src={logoImage} alt="EduLink360 Logo" className="h-10" />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navLinks.map((item) => (
            <NavItem key={item.to} to={item.to} icon={item.icon}>
              {item.label}
            </NavItem>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-700">
          <NavItem to={settingsPath} icon={Settings}>
            Settings
          </NavItem>
          <button
            onClick={handleLogoutClick}
            className="flex items-center p-3 my-1 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white w-full"
          >
            <LogOut />
            <span className="ml-4 font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}
