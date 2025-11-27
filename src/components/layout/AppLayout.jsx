import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "../../context/AuthContext";

const getPageTitle = (pathname, user) => {
  const name =
    user?.fullName?.split(" ")[0] ||
    user?.name?.split(" ")[0] ||
    "User";
  if (pathname.startsWith("/teacher")) {
    switch (pathname) {
      case "/teacher/dashboard":
        return `Welcome back, ${name} 👋`;
      case "/teacher/messages":
        return "Messages";
      case "/teacher/profile":
        return "Profile";
      case "/teacher/settings":
        return "Settings";
      case "/teacher/notifications":
        return "Notifications";
      default:
        return "Dashboard";
    }
  }

  switch (pathname) {
    case "/":
      return `Welcome back, ${name} 👋`;
    case "/messages":
      return "Messages";
    case "/assignments":
      return "Assignments";
    case "/notifications":
      return "Notifications";
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

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitle} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
