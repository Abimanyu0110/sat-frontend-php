import { useEffect, useState } from "react";
import axios from "axios";

// Components
import { Popup } from "../../components/Common/Popup";

// Utils
import API from "../../../Utils/API";
import navLinks from "../../../Utils/navLinks";
// Hooks
import useAdmin from "../../../Hooks/useAdmin";
import { useNavigate } from "react-router-dom";

const ViewAttendance = ({
    date
}) => {
    const navigate = useNavigate(); // useNavigate()
    const { header, admin, formatDate } = useAdmin(); // useAdmin hook

    const [attendanceDatas, setAttendanceDatas] = useState([]); // For Store student attendance Datas from DB
    const [loading, setLoading] = useState(false); // For Loader
    const [popup, setPop] = useState(null); // For Popup message

    // Get Attendance Datas from DB
    const getAttendanceByDate = async () => {
        if (!date) return;
        setLoading(true);
        try {
            const res = await axios.get(
                API.HOST + API.ATTENDANCE_DATA_BY_DATE,
                {
                    params: {
                        date: date,
                        id: admin.userId
                    },
                    ...header()
                }
            );

            if (res.data.code === 200) {
                setAttendanceDatas(res.data.data);
            }
        } catch (err) {
            if (err.response && err.response.status === 401) { // Auth error
                navigate(navLinks.LOGIN); // redirect to login page
            } else {
                setPop({ title: "Couldn't able to get Datas", type: "error" }); // error popup
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAttendanceByDate();
    }, []);

    return (
        <div>
            {popup != null && <Popup unmount={() => setPop(null)} title={popup.title} type={popup.type} />}
            <h2 className="text-xl font-semibold mb-4 text-sky-700">
                View Attendance - <span className="font-bold text-gray-600-">{formatDate(date)}</span>
            </h2>

            {loading ?
                (
                    <div className="px-4 py-15 text-center text-gray-600">
                        Loading...
                    </div>
                ) : (
                    <div className="border border-gray-200 shadow rounded-lg overflow-auto max-h-[400px]">
                        <table className="w-full">
                            <thead className="bg-sky-700 text-white">
                                <tr>
                                    <th className="border- p-2 px-2 text-start">Register No</th>
                                    <th className="border- p-2 text-start">Name</th>
                                    <th className="border- py-2 px-2 text-center">Attendance</th>
                                </tr>
                            </thead>

                            <tbody>
                                {attendanceDatas.map(student => (
                                    <tr key={student.id} className="border-b border-gray-300 text-gray-600">
                                        <td className="p-2">
                                            {student.registerNumber}
                                        </td>
                                        <td className=" p-2">
                                            {student.name}
                                        </td>
                                        <td className={`p-2 flex justify-center 
                                    ${student.status === 1 ? "text-green-600" : "text-red-600"}`}>
                                            {student.status === 1 ? "Present" : "Absent"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

        </div>
    );
};

export default ViewAttendance;
