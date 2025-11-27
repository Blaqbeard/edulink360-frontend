import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "../../context/AuthContext";

// Function to get the correct page title based on the URL
const getPageTitle = (pathname, user) => {
  // Use optional chaining and provide a fallback
  const name = user?.fullName?.split(" ")[0] || "User";
  switch (pathname) {
    case "/":
      return `Welcome back, ${name} 👋`;
    case "/messages":
      // This page has its own layout, but we can keep the title logic
      return "Messages";
    case "/profile":
      return "Profile";
    case "/settings":
      return "Account";
    default:
      return "Dashboard";
  }
};

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname, user);

  // The 'isSlim' logic is now handled by responsive classes directly inside the Sidebar,
  // so we no longer need the useMediaQuery hook here. This simplifies the layout component.

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitle} onMenuClick={() => setIsSidebarOpen(true)} />

        {/* --- THIS IS THE CORRECTED PART --- */}
        <main className="flex-1 overflow-y-auto">
          {/* 1. This inner div now handles the centering and padding. */}
          {/* 'mx-auto' centers the block horizontally. */}
          {/* 'max-w-7xl' prevents content from getting too wide on large screens. */}
          {/* 'p-4 sm:p-6 lg:p-8' adds responsive padding around all pages. */}
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
