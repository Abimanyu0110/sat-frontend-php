import { Routes, Route } from "react-router-dom";

//------------- Pages -------------------
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Login/adminSignup";
import Layout from "./pages/Layout";
import DashboardAdmin from "./pages/Dashboard/DashboardAdmin";
import DashboardTeacher from "./pages/Dashboard/DashboardTeacher";
import TeachersList from "./pages/Teacher/TeachersList";
import StudentsList from "./pages/Student/StudentsList";
import AttendanceList from "./pages/Attendance/AttendanceList";
import Report from "./pages/Report/Report";

function AppRoutes() {
  return (
    <>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected layout with Navbar + Sidebar */}
        <Route path="/main" element={<Layout />}>

          <Route path="dashboardAdmin" element={<DashboardAdmin />} />
          <Route path="dashboardTeacher" element={<DashboardTeacher />} />
          <Route path="teachersList" element={<TeachersList />} />
          <Route path="studentsList" element={<StudentsList />} />
          <Route path="attendanceList" element={<AttendanceList />} />
          <Route path="report" element={<Report />} />

        </Route>
      </Routes>
    </>
  );
}

export default AppRoutes;