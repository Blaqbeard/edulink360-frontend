import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "../../context/AuthContext";

// Custom hook to check screen size for responsive behavior
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
};

// Function to get the correct page title based on the URL
const getPageTitle = (pathname, user) => {
  const name = user?.fullName?.split(" ")[0] || "";
  switch (pathname) {
    case "/":
      return `Welcome back, ${name} 👋`;
    case "/messages":
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
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isSlim = isTablet;
  const pageTitle = getPageTitle(location.pathname, user);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isSlim={isSlim}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitle} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto flex">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
