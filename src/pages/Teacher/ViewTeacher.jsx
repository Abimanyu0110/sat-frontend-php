import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Components
import { Popup } from "../../components/Common/Popup";

// Utils
import API from "../../../Utils/API";
import navLinks from "../../../Utils/navLinks";

// Hooks
import useAdmin from "../../../Hooks/useAdmin";

const ViewTeacher = ({
    id
}) => {
    const { header, admin, formatDate } = useAdmin(); // useAdmin Hook
    const navigate = useNavigate(); // useNavigate

    const [loading, setLoading] = useState(false); // For Loading
    const [teachers, setTeachers] = useState([]); // For Store Datas from DB
    const [popup, setPop] = useState(null); // For Popup messages

    // For Get datas from DB
    const getTeachersById = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await axios.get(
                API.HOST + API.GET_ADMIN_BY_ID,
                {
                    params: { id: id },
                    ...header()
                }
            );

            if (res.data.code === 200) {
                const dbData = res?.data?.data;
                const details = [
                    { label: "First Name", value: dbData.firstName || "-" },
                    { label: "Last Name", value: dbData.lastName || "-" },
                    { label: "D.O.B", value: formatDate(dbData.dob) || "-" },
                    { label: "Gender", value: dbData.gender || "-" },
                    { label: "Email", value: dbData.email || "-" },
                    { label: "Class", value: dbData.class || "-" },
                    { label: "Section", value: dbData.section || "-" },
                    { label: "Subject", value: dbData.subject || "-" },
                ];
                setTeachers(details)
            }
        } catch (err) {
            if (err.response && err.response.status === 401) { // Auth Failure check
                navigate(navLinks.LOGIN); // redirect to login page
            } else {
                setPop({ title: "Couldn't able to get data", type: "error" });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTeachersById();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-sky-700">
                View Teacher
            </h2>

            {loading ?
                (
                    <div className="px-4 py-15 text-center text-gray-600">
                        Loading...
                    </div>
                ) : (
                    <div className="border border-gray-200 shadow rounded-lg p-4">
                        {popup != null && <Popup unmount={() => setPop(null)} title={popup.title} type={popup.type} />}

                        <div className="space-y-3 w-full">
                            {teachers.map((item, index) => (
                                <div key={index} className={`w-full flex`}>
                                    <h2 className="font-semibold w-1/3 text-gray-700">
                                        {item.label} :
                                    </h2>
                                    <p className="w-2/3 text-gray-600 flex items-center">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                    </div>
                )}

        </div>
    );
};

export default ViewTeacher;
