import React from "react";
import { Routes, Route } from "react-router-dom";

// --- Layouts ---
import AppLayout from "../components/layout/AppLayout";
import AuthLayout from "../components/layout/AuthLayout";
import MessagesLayout from "../components/layout/MessagesLayout"; // 1. Import the special layout for Messages

// --- Page Components ---
import Dashboard from "../pages/Dashboard";
import Messages from "../pages/Messages";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
// import SignUp from "../pages/SignUp";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}
      </Route>

      <Route path="/messages" element={<MessagesLayout />}>
        <Route index element={<Messages />} />
      </Route>

      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
