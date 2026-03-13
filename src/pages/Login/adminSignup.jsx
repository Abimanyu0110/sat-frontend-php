import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

// -------------- Components ---------------------
import TextField from "../../components/Common/TextField";
import Button from "../../components/Common/Button";
import Dropdown from "../../components/Common/Dropdown";
import { Popup } from "../../components/Common/Popup";

// -------------- Utils ------------------------
import navLinks from "../../../Utils/navLinks";
import API from "../../../Utils/API";

// -------------- Hooks ---------------------
import useAdmin from "../../../Hooks/useAdmin";

const Signup = () => {

    const navigate = useNavigate(); // useNavigate()
    const { header } = useAdmin(); // useAdmin Hooks
    const role = "ADMIN";

    const [btnLoading, setBtnLoading] = useState(false); // Button Loading
    const [popup, setPop] = useState(null); // For Popup message

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            dob: null,
            gender: "",
            email: "",
            password: "",
            confirmPassword: "",
            organizationName: "",
            secretCode: "",
            role: role,
            organizationCode: "",
            shortName: ""
        },

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
            password: yup
                .string()
                .min(6, "Minimum " + " 6")
                .max(12, "Maximum " + " 12")
                .required("Required"),
            confirmPassword: yup
                .string()
                .oneOf([yup.ref("password")], "Passwords must match")
                .required("Required"),
            organizationName: yup
                .string()
                .min(5, "Minimum " + " 5")
                .max(100, "Maximum" + " 100")
                .required("Required"),
            secretCode: yup
                .string()
                .matches(/^[A-Za-z0-9]{6}$/, "Must be exactly 6 letters and numbers")
                .required("Required"),
            shortName: yup
                .string()
                .matches(/^[a-z]{5}$/, "Must be exactly 5 lowercase letters")
                .required("Required"),
            organizationCode: yup
                .string()
                .matches(/^\d{4}$/, "Must be exactly 4 digits")
                .required("Required"),
        }),
        validateOnMount: false,
        validateOnBlur: false,
        validateOnChange: false,

        onSubmit: async (e, { resetForm }) => {
            setBtnLoading(true);

            const payload = {
                firstName: e.firstName,
                lastName: e.lastName,
                dob: new Date(e.dob).toISOString().split("T")[0],
                gender: e.gender,
                email: e.email,
                password: e.password,
                organizationName: e.organizationName,
                secretCode: e.secretCode,
                role: role,
                organizationCode: e.organizationCode,
                shortName: e.shortName
            }

            try {
                const { data } = await axios.post(API.HOST + API.ADMIN_SIGNUP, payload, header())
                if (data.code === 200) {
                    setPop({ title: data.message, type: "success" }); // Success popup
                    resetForm();
                    navigate(navLinks.LOGIN)
                } else {
                    setPop({ title: data.message, type: "error" }); // error popup
                }
            } catch (error) {
                alert("new error : " + JSON.stringify(error))
                console.log("new error : " + JSON.stringify(error))
                setPop({ title: "There was an error submitting the form.", type: "error" }); // error popup
            } finally {
                setBtnLoading(false);
            }
        },
    });

    const cancel = () => {
        navigate(navLinks.LOGIN)
    }

    return (
        <>
            {popup != null && <Popup unmount={() => setPop(null)} title={popup.title} type={popup.type} />}
            <div className="flex min-h-screen w-full flex-col items-center justify-center p-5 md:p-10">
                <h1 className="mb-6 text-center text-3xl font-bold text-sky-700">
                    Admin Signup
                </h1>

                <form className="mx-auto w-full max-w-lg space-y-4 rounded-xl border border-gray-200 px-5 py-8 md:p-10 shadow-xl"
                    onSubmit={formik.handleSubmit} noValidate>
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
                        value={formik.values.gender}
                        error={formik.errors.gender}
                        onChange={(e) => formik.setFieldValue("gender", e)}
                        placeholder="Select gender"
                        options={[
                            { label: "Male", value: "MALE" },
                            { label: "Female", value: "FEMALE" },
                            { label: "Other", value: "OTHER" },
                        ]}
                        flex="flex flex-col md:flex-row md:items-center"
                        required
                    />

                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formik.values.email}
                        error={formik.errors.email}
                        onChange={(e) => formik.setFieldValue("email", e)}
                        flex="flex flex-col md:flex-row md:items-center"
                        required
                    />

                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter password"
                        value={formik.values.password}
                        error={formik.errors.password}
                        onChange={(e) => formik.setFieldValue("password", e)}
                        flex="flex flex-col md:flex-row md:items-center"
                        required
                    />

                    <TextField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Enter Cofirm password"
                        value={formik.values.confirmPassword}
                        error={formik.errors.confirmPassword}
                        onChange={(e) => formik.setFieldValue("confirmPassword", e)}
                        flex="flex flex-col md:flex-row md:items-center"
                        required
                    />

                    <TextField
                        label="Organization Name"
                        name="organizationName"
                        type="text"
                        placeholder="Enter Organization Name"
                        value={formik.values.organizationName}
                        error={formik.errors.organizationName}
                        onChange={(e) => formik.setFieldValue("organizationName", e)}
                        flex="flex flex-col md:flex-row md:items-center"
                        required
                    />

                    <TextField
                        label="Organization Code"
                        name="organizationCode"
                        type="number"
                        placeholder="Enter 4 digit code"
                        value={formik.values.organizationCode}
                        error={formik.errors.organizationCode}
                        onChange={(e) => formik.setFieldValue("organizationCode", e)}
                        flex="flex flex-col md:flex-row md:items-center"
                        required
                    />

                    <TextField
                        label="Secret Code"
                        name="secretCode"
                        type="text"
                        placeholder="Enter 6 Letters or Numbers"
                        value={formik.values.secretCode}
                        error={formik.errors.secretCode}
                        onChange={(e) => formik.setFieldValue("secretCode", e)}
                        flex="flex flex-col md:flex-row md:items-center"
                        required
                    />

                    <TextField
                        label="Short Name"
                        name="shortName"
                        type="text"
                        placeholder="Enter 5 lowercase letters"
                        value={formik.values.shortName}
                        error={formik.errors.shortName}
                        onChange={(e) => formik.setFieldValue("shortName", e)}
                        flex="flex flex-col md:flex-row md:items-center"
                        required
                    />

                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 mt-5">
                        <Button
                            label="Cancel & Go Back"
                            bgAndTextColor="bg-gray-200 text-gray-900"
                            onClick={cancel}
                        />

                        <Button
                            loading={btnLoading}
                            label="Submit"
                            type="submit"
                        />
                    </div>

                </form>
            </div>
        </>
    )
}

export default Signup;