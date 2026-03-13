import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Components
import Button from "../../components/Common/Button";
import { Popup } from "../../components/Common/Popup";

// Utils
import API from "../../../Utils/API";
import navLinks from "../../../Utils/navLinks";

// Hooks
import useAdmin from "../../../Hooks/useAdmin";

const DashboardAdmin = () => {

  const navigate = useNavigate(); // useNavigate()
  const { header, admin, formatDate } = useAdmin(); // useAdmin Hooks

  const [adminDatas, setAdminDatas] = useState(); // For storing admin datas from DB
  const [attendanceList, setAttendanceList] = useState([]); // For storing attendance List from DB
  const [loading, setLoading] = useState(false); // For Loading
  const [popup, setPop] = useState(null); // For Popup message
  const id = admin.userId; // userIf from admin Hooks

  // Get Datas from DB
  const getAdminDashboard = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const res = await axios.get(
        API.HOST + API.GET_ADMIN_DASHOARD,
        {
          params: { id: id },
          ...header()
        }
      );
      const data = res.data.data;

      if (res.data.code === 200) {
        setAdminDatas(data.adminDatas || "");
        setAttendanceList(data.attendanceList || []);
      }
    }
    catch (err) {
      // Check if the error is from server (401)
      if (err.response && err.response.status === 401) { // Auth error
        navigate(navLinks.LOGIN); // redirect to login page
      } else {
        setPop({ title: "Couldn't able to get Datas", type: "error" }); // error popup
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAdminDashboard();
  }, [])

  return (
    <>
      {popup != null && <Popup unmount={() => setPop(null)} title={popup.title} type={popup.type} />}
      {loading ?
        (
          <div className="text-gray-600 bg-gray-50 flex items-center justify-center h-full md:text-2xl md:font-semibold">
            Loading...
          </div>
        ) : (
          <div className="fixed top-14 left-0 lg:left-55 right-0 bottom-0 bg-gray-50 p-4 md:p-6 overflow-y-auto">

            {/* Page Title */}
            <h1 className="text-2xl font-semibold text-sky-800 mb-6">
              Admin Dashboard
            </h1>

            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

              <div className="bg-white p-5 rounded-lg shadow gap-2">
                <p className="text-sm text-gray-600">Total Teachers</p>
                <h2 className="text-2xl font-bold text-sky-600">{adminDatas?.totalTeachers}</h2>
              </div>

              <div className="bg-white p-5 rounded-lg shadow gap-2">
                <p className="text-sm text-gray-500">Total Students</p>
                <h2 className="text-2xl font-bold text-sky-600">{adminDatas?.totalStudents}</h2>
              </div>

              <div className="bg-white p-5 rounded-lg shadow gap-2">
                <p className="text-sm text-gray-500">Today Present</p>
                <h2 className="text-2xl font-bold text-sky-600">{adminDatas?.todayPresent}</h2>
              </div>

              <div className="bg-white p-5 rounded-lg shadow gap-2">
                <p className="text-sm text-gray-500">Today Absent</p>
                <h2 className="text-2xl font-bold text-sky-600">{adminDatas?.todayAbsent}</h2>
              </div>

              <div className="bg-white p-5 rounded-lg shadow gap-2">
                <p className="text-sm text-gray-500">My School</p>
                <h2 className="text-2xl font-bold text-sky-600">{adminDatas?.organizationName}</h2>
              </div>

              <div className="bg-white p-5 rounded-lg shadow gap-2">
                <p className="text-sm text-gray-500">School Code</p>
                <h2 className="text-2xl font-bold text-sky-600">{adminDatas?.organizationCode}</h2>
              </div>

              <div className="bg-white p-5 rounded-lg shadow gap-2">
                <p className="text-sm text-gray-500">Short Name</p>
                <h2 className="text-2xl font-bold text-sky-600">{adminDatas?.shortName}</h2>
              </div>

              <div className="bg-white p-5 rounded-lg shadow gap-2">
                <p className="text-sm text-gray-500">Secret Code</p>
                <h2 className="text-2xl font-bold text-sky-600">{adminDatas?.secretCode}</h2>
              </div>

            </div>

            {/* Management Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

              {/* Teacher Management */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">
                  Teacher Management
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Add, edit, assign classes and manage teachers.
                </p>
                <Button
                  label="Manage Teachers"
                  className={`text-sm`}
                  onClick={() => { navigate(navLinks.TEACHERS_LIST) }}
                />
              </div>

              {/* Student Management */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">
                  Student Management
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Add, edit students and assign to classes.
                </p>
                <Button
                  label="Manage Students"
                  className={`text-sm`}
                  onClick={() => { navigate(navLinks.STUDENTS_LIST) }}
                />
              </div>

              {/* Attendance Reports */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">
                  Attendance Reports
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  View student-wise and monthly attendance reports.
                </p>
                <Button
                  label="View Reports"
                  className={`text-sm`}
                  onClick={() => { navigate(navLinks.REPORT) }}
                />
              </div>

            </div>

            {/* Attendance Overview Table */}
            <div className="bg-white rounded-lg shadow  p-4">

              <div className="pb-4">
                <h2 className="text-lg font-semibold text-sky-800">
                  Recent Attendance Overview
                </h2>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg">
                <table className="w-full">
                  <thead className="bg-sky-700 text-white">
                    <tr>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Class</th>
                      <th className="p-3 text-left">Section</th>
                      <th className="p-3 text-left">Marked By</th>
                      <th className="p-3 text-left">Total Students</th>
                      <th className="p-3 text-left">Total Present</th>
                      <th className="p-3 text-left">Total Absent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList.length > 0 ? (
                      attendanceList.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-3">{formatDate(item.date)}</td>
                          <td className="p-3">{item.class}</td>
                          <td className="p-3">{item.section}</td>
                          <td className="p-3">{item.teacher}</td>
                          <td className="p-3">{item.totalStudents}</td>
                          <td className="p-3 text-green-600">{item.totalPresent}</td>
                          <td className="p-3 text-red-600">{item.totalAbsent}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-6 text-center text-gray-600" colSpan="7">
                          No Data
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>
              </div>

            </div>

          </div >
        )}
    </>
  )
}

export default DashboardAdmin;
