import React from "react";
import { UserCheck, BellRing, Target } from "lucide-react";

import logo from "../../assets/images/logo.jpg";

export default function BrandingPanel() {
  return (
    <div className="flex flex-col justify-between h-full px-12 py-10 bg-[#0F172A] text-white">
      {/* Logo */}
      <div>
        <img src={logo} alt="EduLink360 Logo" className="h-10 object-contain" />
      </div>

      {/* Main Text */}
      <div className="mt-10">
        <h1 className="text-4xl font-extrabold leading-snug tracking-tight">
          Step into your classroom,
          <span className="text-orange-400"> anywhere!</span>
        </h1>

        <p className="mt-4 text-lg text-gray-200 leading-relaxed font-medium">
          Stay linked to what matters...learning!
        </p>

        {/* Features */}
        <div className="mt-10 space-y-6">
          {/* 1 — Track Your Progress */}
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-blue-600/20 text-blue-400">
              <UserCheck size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Track Your Progress</h3>
              <p className="text-sm text-gray-400">
                Monitor assignments, feedback, and overall performance
              </p>
            </div>
          </div>

          {/* 2 — Stay Connected */}
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-orange-600/20 text-orange-400">
              <BellRing size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Stay Connected</h3>
              <p className="text-sm text-gray-400">
                Get instant notifications and feedback from teachers and
                students
              </p>
            </div>
          </div>

          {/* 3 — Achieve Set Goals */}
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-green-600/20 text-green-400">
              <Target size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Achieve Set Goals</h3>
              <p className="text-sm text-gray-400">
                Complete courses and unlock your potentials
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-sm text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} EduLink360. All rights reserved.
      </footer>
    </div>
  );
}
