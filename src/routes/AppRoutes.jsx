import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
import AppLayout from "../components/layout/AppLayout";
import AuthLayout from "../components/layout/AuthLayout";

// Student Pages
import Dashboard from "../pages/Dashboard";
import Messages from "../pages/Messages";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

// Teacher Pages
import TeacherDashboard from "../pages/TeacherDashboard";
import TeacherMessages from "../pages/TeacherMessages";
import TeacherProfile from "../pages/TeacherProfile";
import TeacherSettings from "../pages/TeacherSettings";
import TeacherNotifications from "../pages/TeacherNotifications";

export default function AppRoutes() {
  return (
    <Routes>
      {/* AUTH PAGES - PUBLIC */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* STUDENT APP PAGES */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* TEACHER APP PAGES */}
      <Route path="/teacher" element={<AppLayout />}>
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="messages" element={<TeacherMessages />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="settings" element={<TeacherSettings />} />
        <Route path="notifications" element={<TeacherNotifications />} />
      </Route>
    </Routes>
  );
}
