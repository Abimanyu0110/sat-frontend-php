const API = {
    HOST: import.meta.env.VITE_API_HOST || "http://localhost:8080",

    // --------------- Admin ----------------------
    ADMIN_SIGNUP: "/api/admin/signup",
    TEACHER_SIGNUP: "/api/admin/teacherSignup",
    LOGIN: "/api/admin/login",
    TEACHERS_LIST: "/api/admin/getTeachersList",
    GET_ADMIN_BY_ID: "/api/admin/getAdminDataById",

    GET_TEACHER_DASHOARD: "/api/admin/getTeacherDashboard",
    GET_ADMIN_DASHOARD: "/api/admin/getAdminDashboard",

    DELETE_DATA: "/api/admin/deleteDataById",

    // --------------- Report ----------------------
    GET_REPORT: "/api/admin/getAttendanceReport",

    // --------------- Student ----------------------
    MANAGE_STUDENT: "/api/student/manageStudent",
    STUDENTS_LIST: "/api/student/getStudentsList",
    GET_STUDENT_BY_ID: "/api/student/getStudentDataById",

    // --------------- Attendance ----------------------
    MANAGE_ATTENDANCE: "/api/attendance/manageAttendance",
    ATTENDANCE_LIST_BY_DATE: "/api/attendance/getAttendanceListByDate",
    ATTENDANCE_DATA_BY_DATE: "/api/attendance/getAttendanceDataByDate",

};

export default API;