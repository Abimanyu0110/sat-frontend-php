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

const DashboardTeacher = () => {

    const navigate = useNavigate(); // useNavigate()
    const { header, admin, formatDate } = useAdmin(); // useAdmin Hook

    const [teacherDatas, setTeacherDatas] = useState(); // For storing teacher datas from DB
    const [attendanceList, setAttendanceList] = useState([]); // For storing attendance List from DB
    const [loading, setLoading] = useState(false); // For Loading
    const [popup, setPop] = useState(null); // For Popup message
    const id = admin.userId; // userId from admin Hooks

    // Get Dashboard Datas from DB
    const getTeacherDashboard = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await axios.get(
                API.HOST + API.GET_TEACHER_DASHOARD,
                {
                    params: { id: id },
                    ...header()
                }
            );
            const data = res.data.data;

            if (res.data.code === 200) {
                setTeacherDatas(data.teacherDatas || "");
                setAttendanceList(data.attendanceList || []);
            }
        }
        catch (err) {
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
        getTeacherDashboard();
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
                    <div className="fixed top-14 left-0 lg:left-55  right-0 bottom-0 bg-gray-50 p-4 md:p-6 overflow-y-auto">

                        {/* Page Title */}
                        <h1 className="text-2xl font-semibold text-sky-700 mb-4">
                            Teacher Dashboard
                        </h1>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                            <div className="bg-white p-5 rounded-lg shadow gap-2">
                                <p className="text-sm text-gray-500">My Students</p>
                                <h2 className="text-2xl font-bold text-sky-600">{teacherDatas?.myStudents || 0}</h2>
                            </div>

                            <div className="bg-white p-5 rounded-lg shadow gap-2">
                                <p className="text-sm text-gray-500">Today Present</p>
                                <h2 className="text-2xl font-bold text-sky-600">{teacherDatas?.todayPresent || 0}</h2>
                            </div>

                            <div className="bg-white p-5 rounded-lg shadow gap-2">
                                <p className="text-sm text-gray-500">Today Absent</p>
                                <h2 className="text-2xl font-bold text-sky-600">{teacherDatas?.todayAbsent || 0}</h2>
                            </div>

                            <div className="bg-white p-5 rounded-lg shadow gap-2">
                                <p className="text-sm text-gray-500">My Class</p>
                                <h2 className="text-2xl font-bold text-sky-600">{(teacherDatas?.class || "") + " " + (teacherDatas?.section || "")}</h2>
                            </div>

                            <div className="bg-white p-5 rounded-lg shadow gap-2">
                                <p className="text-sm text-gray-500">My School</p>
                                <h2 className="text-2xl font-bold text-sky-600">{teacherDatas?.organizationName || ""}</h2>
                            </div>

                            <div className="bg-white p-5 rounded-lg shadow gap-2">
                                <p className="text-sm text-gray-500">School Code</p>
                                <h2 className="text-2xl font-bold text-sky-600">{teacherDatas?.organizationCode || ""}</h2>
                            </div>

                        </div>

                        {/* Teacher Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                            {/* Mark Attendance */}
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h2 className="text-lg font-semibold mb-3 text-gray-700">
                                    Mark Attendance
                                </h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    Mark daily attendance for your assigned class.
                                </p>
                                <Button
                                    label="Take Attendance"
                                    className={`text-sm`}
                                    onClick={() => { navigate(navLinks.ATTENDANCE_LIST) }}
                                />
                            </div>

                            {/* View Reports */}
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

                        {/* Recent Attendance */}
                        <div className="bg-white rounded-lg shadow p-4">

                            <div className="pb-4">
                                <h2 className="text-lg font-semibold text-sky-800">
                                    Recent Attendance
                                </h2>
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg">
                                <table className="w-full">
                                    <thead className="bg-sky-700 text-white">
                                        <tr>
                                            <th className="p-3 text-left">Date</th>
                                            <th className="p-3 text-left">Total Students</th>
                                            <th className="p-3 text-left">Present</th>
                                            <th className="p-3 text-left">Absent</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceList.length > 0 ? (
                                            attendanceList.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="p-3">{formatDate(item.date)}</td>
                                                    <td className="p-3">{item.totalStudents}</td>
                                                    <td className="p-3 text-green-600">{item.totalPresent}</td>
                                                    <td className="p-3 text-red-600">{item.totalAbsent}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="p-6 text-center text-gray-600" colSpan="4">
                                                    No Data
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>

                    </div>
                )}
        </>
    )
}

export default DashboardTeacher;
