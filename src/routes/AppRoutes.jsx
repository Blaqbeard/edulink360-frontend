import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import AppLayout from "../components/layout/AppLayout";
import AuthLayout from "../components/layout/AuthLayout";
import MessagesLayout from "../components/layout/MessagesLayout";

// Student Pages
import Dashboard from "../pages/Dashboard";
import Messages from "../pages/Messages";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Assignments from "../pages/Assignments";
import Notifications from "../pages/Notifications";
import Portfolio from "../pages/Portfolio";
import CareerGuidance from "../pages/CareerGuidance";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

// Teacher Pages
import TeacherDashboard from "../pages/TeacherDashboard";
import TeacherMessages from "../pages/TeacherMessages";
import TeacherProfile from "../pages/TeacherProfile";
import TeacherSettings from "../pages/TeacherSettings";
import TeacherNotifications from "../pages/TeacherNotifications";
import TeacherAssignments from "../pages/TeacherAssignments";
import Upskilling from "../pages/Upskilling";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC AUTH PAGES */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Standalone signup page */}
      <Route path="/signup" element={<Signup />} />

      {/* STUDENT APP PAGES */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="career" element={<CareerGuidance />} />
      </Route>

      {/* Student Messages use a custom layout */}
      <Route
        path="/messages"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <MessagesLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Messages />} />
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
      <Route
        path="/teacher/assignments"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherAssignments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/upskilling"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <Upskilling />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
