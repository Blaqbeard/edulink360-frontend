import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import Signup from "./pages/Signup";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherSettings from "./pages/TeacherSettings";
import TeacherMessages from "./pages/TeacherMessages";
import TeacherNotifications from "./pages/TeacherNotifications";

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/profile" element={<TeacherProfile />} />
          <Route path="/teacher/settings" element={<TeacherSettings />} />
          <Route path="/teacher/messages" element={<TeacherMessages />} />
          <Route
            path="/teacher/notifications"
            element={<TeacherNotifications />}
          />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
