import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

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
      </Route>

      {/* SIGNUP PAGE - Standalone with its own layout */}
      <Route path="/signup" element={<Signup />} />

      {/* STUDENT APP PAGES - Protected for students only */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* TEACHER APP PAGES - Protected for teachers only (standalone layouts) */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/messages"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherMessages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/profile"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/settings"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/notifications"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherNotifications />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
