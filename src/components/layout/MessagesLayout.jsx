import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";


export default function MessagesLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        // The 'isSlim' prop is now controlled directly by Tailwind's responsive prefixes
        // inside the Sidebar component itself. We don't need to calculate it here.
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* The Outlet will render the Messages page, which will now fill the remaining space */}
      <div className="flex-1 flex">
        <Outlet />
      </div>
    </div>
  );
}
