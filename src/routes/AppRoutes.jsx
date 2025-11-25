import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
import AppLayout from "../components/layout/AppLayout";
import AuthLayout from "../components/layout/AuthLayout";

// Pages
import Dashboard from "../pages/Dashboard";
import Messages from "../pages/Messages";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

export default function AppRoutes() {
  return (
    <Routes>
      {/* AUTH PAGES - PUBLIC */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* MAIN APP PAGES - ALSO PUBLIC FOR NOW */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
