import React from "react";
import LanguageSelector from "../common/LanguageSelector";
import { useNotifications } from "../../context/NotificationContext";
import { authService } from "../../services/authService";

export default function TeacherTopBar({
  title = "Dashboard overview",
  subtitle = "",
  variant = "welcome", // "welcome" | "title"
  onMenuClick,
  onAvatarClick,
  onBellClick,
}) {
  const { unreadCount } = useNotifications();
  const user = authService.getCurrentUser();
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "TU";
  const firstName = user?.name ? user.name.split(" ")[0] : "Teacher";

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between gap-3">
        {/* Left: menu + text */}
        <div className="flex items-center gap-3 min-w-0">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="md:hidden w-9 h-9 bg-[#0b1633] text-white rounded-lg flex items-center justify-center hover:bg-[#1A2332] transition-colors shrink-0"
            >
              <i className="bi bi-list text-lg"></i>
            </button>
          )}
          <div className="min-w-0">
            {variant === "welcome" ? (
              <>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Welcome back,
                </p>
                <p className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {firstName}
                </p>
                <p className="text-[11px] sm:text-xs text-gray-500 truncate">
                  {subtitle || "Teacher"}
                </p>
              </>
            ) : (
              <>
                <p className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {title}
                </p>
                {subtitle && (
                  <p className="text-[11px] sm:text-xs text-gray-500 truncate">
                    {subtitle}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right: language, bell, avatar */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <button
            type="button"
            onClick={onBellClick}
            className="relative w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <i className="bi bi-bell text-sm"></i>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onAvatarClick}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-[#FF8A56] rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200 text-white font-bold text-xs sm:text-sm"
          >
            {initials}
          </button>
        </div>
      </div>
    </header>
  );
}


