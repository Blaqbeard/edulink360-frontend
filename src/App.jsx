import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
// import TeacherDashboard from "./pages/TeacherDashboard"; // TODO: Uncomment when TeacherDashboard is ready

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<Signup />} />
        {/* TODO: Uncomment when TeacherDashboard is ready */}
        {/* <Route path="/teacher/dashboard" element={<TeacherDashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
