
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

// Components 
import TextField from "../../components/Common/TextField";
import Button from "../../components/Common/Button";
import Dropdown from "../../components/Common/Dropdown";
import { Popup } from "../../components/Common/Popup";

// Utils
import navLinks from "../../../Utils/navLinks";
import API from "../../../Utils/API";

// Hooks
import useAdmin from "../../../Hooks/useAdmin";

const ManageTeacher = ({
    closePopup,
    onSuccess,
    id
}) => {

    const navigate = useNavigate(); // useNavigate
    const { header, admin, toLocalDate } = useAdmin(); // useAdmin Hooks

    const [loading, setLoading] = useState(false); // For Loading
    const [btnLoading, setBtnLoading] = useState(false); // For Button Loading
    const [popup, setPop] = useState(null); // For Popup messages

    const role = "TEACHER";
    const adminId = admin.userId;

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            dob: "",
            gender: "",
            email: "",
            password: "",
            confirmPassword: "",
            organizationName: "",
            secretCode: "",
            role: role,
            class: "",
            section: "",
            subject: "",
        },
        validateOnMount: false,
        validateOnBlur: false,
        validateOnChange: false,
        isInitialValid: false,
        // enableReinitialize: true,
        validationSchema: yup.object().shape({
            firstName: yup
                .string()
                .matches(/^[A-Za-z\s]+$/, "Letters Only")
                .min(2, "Minimum " + " 2")
                .max(25, "Maximum " + " 25")
                .required("Required"),
            lastName: yup
                .string()
                .matches(/^[A-Za-z\s]+$/, "Letters Only")
                .min(1, "Minimum " + " 1")
                .max(25, "Maximum " + " 25")
                .notRequired(),
            dob: yup
                .string()
                .test(
                    "year-range",
                    "Year must be between 1900 and 2099",
                    (value) => {
                        if (!value) return true;

                        const year = parseInt(value.split("-")[0]);
                        return year >= 1900 && year <= 2099;
                    }
                )
                .required("Required"),
            gender: yup
                .string()
                .required("Required"),
            email: yup
                .string()
                .max(100, "Maximum " + " 100")
                .email("Invalid Email ID")
                .required("Required"),
            class: yup
                .number()
                .required("Required"),
            section: yup
                .string()
                .required("Required"),
            subject: yup
                .string()
                .required("Required"),
        }),
        onSubmit: async (e, { resetForm }) => {
            setBtnLoading(true);
            const payload = {
                firstName: e.firstName,
                lastName: e.lastName,
                dob: new Date(e.dob).toISOString().split("T")[0],
                gender: e.gender,
                email: e.email,
                teacherClass: e.class,
                section: e.section,
                subject: e.subject,
                role: role,
                adminId: adminId,
            };

            if (id && id > 0) {
                payload.id = id;
            }

            try {
                const { data } = await axios.post(API.HOST + API.TEACHER_SIGNUP, payload, header())
                if (data.code === 200) {
                    setPop({ title: data.message, type: "success" }); // Success popup
                    resetForm(); // resets form
                    onSuccess(); // Triggers Table refresh
                } else {
                    setPop({ title: data.message, type: "error" }); // error popup
                }
            } catch (error) {
                setPop({ title: "There was an error submitting the form.", type: "error" });
            } finally {
                setBtnLoading(false);
            }
        },
    });

    // For Edit get values from Admins
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
                const dbData = res.data.data
                formik.setFieldValue("firstName", dbData.firstName);
                formik.setFieldValue("lastName", dbData.lastName);
                formik.setFieldValue("dob", toLocalDate(dbData.dob));
                formik.setFieldValue("gender", dbData.gender);
                formik.setFieldValue("email", dbData.email);
                formik.setFieldValue("class", dbData.class);
                formik.setFieldValue("section", dbData.section);
                formik.setFieldValue("subject", dbData.subject);
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
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
        <div className="">
            <h2 className="text-xl font-semibold mb-4 text-sky-700 ">{id > 0 ? "Edit" : "Add"} Teacher</h2>

            {loading ?
                (
                    <div className="px-4 py-15 text-center text-gray-600">
                        Loading...
                    </div>
                ) : (
                    <form className="space-y-4 p-4 px-5 border border-gray-200 shadow-md rounded-lg overflow-auto"
                        onSubmit={formik.handleSubmit} noValidate>
                        {popup != null && <Popup unmount={() => setPop(null)} title={popup.title} type={popup.type} />}

                        <TextField
                            label="First Name"
                            name="firstName"
                            type="text"
                            placeholder="Enter your First Name"
                            flex="flex flex-col md:flex-row md:items-center"
                            value={formik.values.firstName}
                            error={formik.errors.firstName}
                            onChange={(e) => formik.setFieldValue("firstName", e, true)}
                            required
                        />

                        <TextField
                            label="Last Name"
                            name="lastName"
                            type="text"
                            placeholder="Enter your Last Name"
                            flex="flex flex-col md:flex-row md:items-center"
                            value={formik.values.lastName}
                            error={formik.errors.lastName}
                            onChange={(e) => formik.setFieldValue("lastName", e)}
                        />

                        <TextField
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            placeholder="Enter your D.O.B"
                            flex="flex flex-col md:flex-row md:items-center"
                            value={formik.values.dob}
                            error={formik.errors.dob}
                            onChange={(e) => formik.setFieldValue("dob", e)}
                            required
                        />

                        <Dropdown
                            label="Gender"
                            name="gender"
                            flex="flex flex-col md:flex-row md:items-center"
                            value={formik.values.gender}
                            error={formik.errors.gender}
                            onChange={(e) => formik.setFieldValue("gender", e)}
                            placeholder="Select gender"
                            options={[
                                { label: "Male", value: "MALE" },
                                { label: "Female", value: "FEMALE" },
                                { label: "Other", value: "OTHER" },
                            ]}
                            required
                        />

                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            flex="flex flex-col md:flex-row md:items-center"
                            value={formik.values.email}
                            error={formik.errors.email}
                            onChange={(e) => formik.setFieldValue("email", e)}
                            required
                        />

                        <Dropdown
                            label="Class"
                            name="class"
                            flex="flex flex-col md:flex-row md:items-center"
                            value={formik.values.class}
                            error={formik.errors.class}
                            onChange={(e) => formik.setFieldValue("class", e)}
                            placeholder="Select class"
                            options={[
                                { label: "I", value: 1 },
                                { label: "II", value: 2 },
                                { label: "III", value: 3 },
                                { label: "IV", value: 4 },
                                { label: "V", value: 5 },
                            ]}
                            required
                        />

                        <Dropdown
                            label="Section"
                            name="section"
                            flex="flex flex-col md:flex-row md:items-center"
                            value={formik.values.section}
                            error={formik.errors.section}
                            onChange={(e) => formik.setFieldValue("section", e)}
                            placeholder="Select Section"
                            options={[
                                { label: "A", value: "A" },
                                { label: "B", value: "B" },
                            ]}
                            required
                        />

                        <Dropdown
                            label="Subject"
                            name="subject"
                            flex="flex flex-col md:flex-row md:items-center"
                            value={formik.values.subject}
                            error={formik.errors.subject}
                            onChange={(e) => formik.setFieldValue("subject", e)}
                            placeholder="Select Subject"
                            options={[
                                { label: "English", value: "ENGLISH" },
                                { label: "Tamil", value: "TAMIL" },
                                { label: "Maths", value: "MATHS" },
                                { label: "Science", value: "SCIENCE" },
                                { label: "Social Science", value: "SOCIAL_SCIENCE" }
                            ]}
                            required
                        />

                        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 mt-5">
                            <Button
                                label="Cancel"
                                bgAndTextColor="bg-gray-200 text-gray-900"
                                onClick={closePopup}
                            />

                            <Button
                                loading={btnLoading}
                                label="Submit"
                                type="submit"
                            />
                        </div>

                    </form>
                )}

        </div>
    );
};

export default ManageTeacher;