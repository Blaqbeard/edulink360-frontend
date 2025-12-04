import React from "react";
import { Link } from "react-router-dom";
import { BellIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import LanguageSelector from "../common/LanguageSelector";

// Header now accepts a function to toggle the sidebar on mobile

export default function Header({ title, onMenuClick }) {
  const { user } = useAuth(); // This will now work
  const userInitials = user ? user.initials : "...";

  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex items-center justify-between">
        {/* Left side: Hamburger menu (mobile) + Title */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Icon - only visible on screens smaller than lg */}
          <button onClick={onMenuClick} className="text-gray-600 lg:hidden">
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            {title}
          </h1>
        </div>

        {/* Right side remains the same */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <LanguageSelector />
          <button className="text-gray-500 hover:text-gray-700">
            <BellIcon className="h-6 w-6" />
          </button>
          <Link to="/profile">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold cursor-pointer hover:opacity-90">
              {userInitials}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
