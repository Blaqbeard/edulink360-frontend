// src/components/layout/Sidebar.js
import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuMessageSquare,
  LuFileText,
  LuBell,
  LuSettings,
  LuLogOut,
} from "react-icons/lu";
import logo from "../../assets/images/logo.jpg";
import smallLogo from "../../assets/images/logo.jpg"; // A smaller version of the logo for the slim sidebar

const navLinks = [
  { to: "/", text: "Dashboard", icon: <LuLayoutDashboard /> },
  { to: "/messages", text: "Messages", icon: <LuMessageSquare /> },
  { to: "/feedbacks", text: "Feedbacks", icon: <LuFileText /> },
  { to: "/notifications", text: "Notifications", icon: <LuBell /> },
];

// isSlim is for the tablet view, isSidebarOpen is for the mobile view
export default function Sidebar({ isSlim, isSidebarOpen, setIsSidebarOpen }) {
  const activeLinkStyle = {
    backgroundColor: "#2563EB",
    color: "white",
  };

  return (
    <>
      {/* Overlay for mobile view when sidebar is open */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* The Sidebar Itself */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-[#0F172A] text-gray-300 flex flex-col z-40 transition-all duration-300
          ${isSlim ? "w-20" : "w-64"}
          lg:static lg:w-auto
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo Section */}
        <div
          className={`p-6 flex items-center ${
            isSlim ? "justify-center" : "justify-start"
          }`}
        >
          <Link to="/">
            <img
              src={isSlim ? smallLogo : logo}
              alt="EduLink360 Logo"
              className={isSlim ? "h-8" : "h-8"}
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-2 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors ${
                isSlim ? "justify-center" : ""
              }`}
              title={isSlim ? link.text : ""} // Show tooltip on hover in slim mode
            >
              <span className="text-xl">{link.icon}</span>
              {!isSlim && <span>{link.text}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div
          className={`px-4 py-4 border-t border-gray-700 ${
            isSlim ? "space-y-0" : "space-y-2"
          }`}
        >
          <NavLink
            to="/settings"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors ${
              isSlim ? "justify-center" : ""
            }`}
            title={isSlim ? "Settings" : ""}
          >
            <span className="text-xl">
              <LuSettings />
            </span>
            {!isSlim && <span>Settings</span>}
          </NavLink>
          <button
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-900/50 transition-colors ${
              isSlim ? "justify-center" : ""
            }`}
            title={isSlim ? "Log out" : ""}
          >
            <span className="text-xl">
              <LuLogOut />
            </span>
            {!isSlim && <span>Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
