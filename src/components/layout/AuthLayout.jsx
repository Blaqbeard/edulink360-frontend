import React from "react";
import { Outlet } from "react-router-dom";
import BrandingPanel from "../auth/BrandingPanel";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Panel: Branding (hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 bg-[#0F172A]">
        <div className="h-full lg:h-screen lg:sticky lg:top-0">
          <BrandingPanel />
        </div>
      </div>

      {/* Right Panel: Form Content (scrollable independently) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 min-h-screen overflow-y-auto">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
