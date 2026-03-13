import { useEffect, useRef, useState } from "react";
import axios from "axios";

// Components
import Button from "../../components/Common/Button";
import Checkbox from "../../components/Common/CheckBox";
import { Popup } from "../../components/Common/Popup";

// Utils
import API from "../../../Utils/API";
import navLinks from "../../../Utils/navLinks";

// Hooks
import useAdmin from "../../../Hooks/useAdmin";
import { useNavigate } from "react-router-dom";

const ManageAttendance = ({
    closePopup,
    onSuccess,
    selectedDate,
}) => {
    const navigate = useNavigate();
    const { header, admin } = useAdmin();

    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [popup, setPop] = useState(null);

    // Ref to cancel stale runs when effect re-fires (React StrictMode double-invoke)
    const abortRef = useRef(false);

    const isEdit = !!selectedDate;

    useEffect(() => {
        abortRef.current = false; // reset on each run

        const init = async () => {
            setLoading(true);

            try {
                // 1. Fetch students
                const studentsRes = await axios.get(API.HOST + API.STUDENTS_LIST, {
                    params: { id: admin.userId, role: admin.role },
                    ...header()
                });

                if (abortRef.current) return; // stale run, bail out

                if (studentsRes.data.code !== 200) {
                    setPop({ title: "Couldn't load student data", type: "error" });
                    return;
                }
                console.log(JSON.stringify(studentsRes))
                const list = studentsRes.data.data.data;

                // 2. Build default attendance (all false)
                const initialAttendance = {};
                list.forEach(s => { initialAttendance[s.id] = false; });

                // 3. If editing, fetch existing attendance and merge
                if (selectedDate) {
                    try {
                        const attendanceRes = await axios.get(API.HOST + API.ATTENDANCE_DATA_BY_DATE, {
                            params: { date: selectedDate, id: admin.userId },
                            ...header()
                        });

                        if (abortRef.current) return; // stale run, bail out
                        console.log(JSON.stringify(attendanceRes))

                        if (attendanceRes.data.code === 200) {
                            attendanceRes.data.data.forEach(a => {
                                initialAttendance[a.studentId] = a.status == 1;
                            });
                        }
                    } catch (err) {
                        if (abortRef.current) return;
                        if (err.response?.status === 401) {
                            navigate(navLinks.LOGIN);
                            return;
                        }
                        setPop({ title: "Couldn't load attendance data", type: "error" });
                    }
                }

                // 4. Single state update with fully merged data
                setStudents(list);
                setAttendance(initialAttendance);

            } catch (err) {
                if (abortRef.current) return;
                if (err.response?.status === 401) {
                    navigate(navLinks.LOGIN);
                } else {
                    setPop({ title: "Couldn't load student data", type: "error" });
                }
            } finally {
                if (!abortRef.current) setLoading(false);
            }
        };

        init();

        // Cleanup: mark this run as stale if effect re-fires
        return () => { abortRef.current = true; };
    }, [selectedDate]);


    const handleAttendanceChange = (id, value) => {
        setAttendance(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        const payload = students.map(s => ({
            studentId: s.id,
            isPresent: attendance[s.id]
        }));

        try {
            setBtnLoading(true);
            const res = await axios.post(
                API.HOST + API.MANAGE_ATTENDANCE,
                {
                    isEdit,
                    date: selectedDate || new Date().toISOString().split("T")[0],
                    markedBy: admin.userId,
                    attendance: payload
                },
                header()
            );

            if (res.data.code === 200) {
                setPop({ title: res.data.message, type: "success" });
                closePopup();
                onSuccess();
            }
        } catch (error) {
            setPop({ title: "Couldn't able to submit", type: "error" });
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <div>
            {popup != null && (
                <Popup unmount={() => setPop(null)} title={popup.title} type={popup.type} />
            )}

            <h2 className="text-xl font-semibold mb-4 text-sky-700">
                {selectedDate ? "Edit Attendance" : "Mark Attendance"}
            </h2>

            {loading ? (
                <div className="px-4 py-15 text-center text-gray-600">
                    Loading...
                </div>
            ) : (
                <>
                    <div className="border border-gray-200 shadow rounded-lg overflow-auto max-h-[400px]">
                        <table className="w-full">
                            <thead className="bg-sky-700 text-white">
                                <tr>
                                    <th className="p-2 text-start">Register No</th>
                                    <th className="p-2 text-start">Name</th>
                                    <th className="py-2 text-center">Attendance</th>
                                </tr>
                            </thead>

                            <tbody>
                                {students.map(student => (
                                    <tr key={student.id} className="border-b border-gray-300 text-gray-500">
                                        <td className="p-2">{student.registerNumber}</td>
                                        <td className="p-2">{student.firstName} {student.lastName}</td>
                                        <td className="p-2 flex justify-center">
                                            <Checkbox
                                                value={attendance[student.id]}
                                                onChange={val => handleAttendanceChange(student.id, val)}
                                                label={"Present"}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 mt-5">
                        <Button
                            label="Cancel"
                            bgAndTextColor="bg-gray-200 text-gray-900"
                            onClick={closePopup}
                        />
                        <Button
                            label="Save Attendance"
                            loading={btnLoading}
                            onClick={handleSubmit}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default ManageAttendance;