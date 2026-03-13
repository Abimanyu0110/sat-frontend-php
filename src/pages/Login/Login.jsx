import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import * as yup from "yup";
import axios from "axios";

// ---------------- Components --------------------
import TextField from "../../components/Common/TextField";
import Button from "../../components/Common/Button";
import { Popup } from "../../components/Common/Popup";

// ---------------- Utils ------------------------
import navLinks from "../../../Utils/navLinks";
import API from "../../../Utils/API";

// -------------- Hooks ---------------------
import useAdmin from "../../../Hooks/useAdmin";

const Login = () => {

    const { header } = useAdmin(); // useAdmin Hooks
    const navigate = useNavigate(); // useNavigate()

    const [adminLogin, setAdminLogin] = useState(true); // For Admin/Teacher Login
    const [popup, setPop] = useState(null); // For Popup message
    const [btnLoading, setBtnLoading] = useState(false); // For Button login

    // Form state
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        secretCode: "",
    });

    // Error state
    const [errors, setErrors] = useState({});

    // Validation schemas
    const adminSchema = yup.object().shape({
        email: yup.string().email("Invalid Email ID").required("Required"),
        password: yup.string().min(2, "Minimum 2").max(50, "Maximum 50").required("Required"),
    });

    const teacherSchema = yup.object().shape({
        email: yup.string().email("Invalid Email ID").required("Required"),
        secretCode: yup.string().required("Required"),
    });

    // Handle input changes
    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle admin/teacher toggle
    const handleToggle = (isAdmin) => {
        if (adminLogin !== isAdmin) {
            // Only clear if switching type
            setFormData({
                email: "",
                password: "",
                secretCode: "",
            });
            setErrors({});
        }
        setAdminLogin(isAdmin);
    };

    // Form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validate based on type
            if (adminLogin) {
                await adminSchema.validate(
                    { email: formData.email, password: formData.password },
                    { abortEarly: false }
                );
            } else {
                await teacherSchema.validate(
                    { email: formData.email, secretCode: formData.secretCode },
                    { abortEarly: false }
                );
            }

            // Prepare payload
            const payload = {
                email: formData.email
            }
            if (adminLogin) payload.password = formData.password;
            else payload.secretCode = formData.secretCode;

            setBtnLoading(true);

            // Send to API
            const { data } = await axios.post(API.HOST + API.LOGIN, payload, header);

            if (data.code === 200) {
                setPop({ title: data.message, type: "success" }); // Success popup

                setFormData({ email: "", password: "", secretCode: "" });

                const adminData = data.data
                Cookies.set("userId", adminData.userId)
                Cookies.set("userName", adminData.userName)
                Cookies.set("role", adminData.role)
                Cookies.set("accessToken", adminData.accessToken)

                if (adminData.role === "ADMIN") navigate(navLinks.DASHBOARD_ADMIN)
                else navigate(navLinks.DASHBOARD_TEACHER);
            } else {
                setBtnLoading(false);
                setPop({ title: data.message, type: "error" }); // error popup
            }
        } catch (err) {
            // Collect validation errors
            if (err.inner) {
                const validationErrors = {};
                err.inner.forEach((error) => {
                    validationErrors[error.path] = error.message;
                });
                setErrors(validationErrors);
                setBtnLoading(false);
            } else {
                setBtnLoading(false);
                setPop({ title: "There was an error in login.", type: "error" }); // Success popup
            }
        }
    };

    // Navigate to Signup page
    const signup = () => {
        navigate(navLinks.SIGNUP)
    }

    return (
        <>
            {popup != null && <Popup unmount={() => setPop(null)} title={popup.title} type={popup.type} />}
            <div className="flex min-h-screen w-full flex-col items-center justify-center px-5 md:p-10">
                <h1 className="mb-6 text-center text-3xl font-bold text-sky-700">
                    Login
                </h1>

                <form className="mx-auto w-full max-w-md space-y-4 rounded-xl border border-gray-200 px-5 py-8 md:p-10 shadow-xl"
                    onSubmit={handleSubmit}>

                    <div className="flex space-x-4 mb-10">
                        <Button
                            label="Admin"
                            bgAndTextColor={adminLogin ? "bg-gray-50 text-sky-700 border-b-5" : "bg-gray-50 text-gray-400"}
                            className={`font-semibold hover:text-sky-700 hover:bg-gray-100`}
                            rounded="lg"
                            onClick={() => handleToggle(true)}
                        />
                        <Button
                            label="Teacher"
                            bgAndTextColor={!adminLogin ? "bg-gray-50 text-sky-700 border-b-5" : "bg-gray-50 text-gray-400"}
                            className={`font-semibold hover:text-sky-700 hover:bg-gray-100`}
                            rounded="lg"
                            onClick={() => handleToggle(false)}
                        />
                    </div>

                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        error={errors.email}
                        onChange={(e) => handleChange("email", e)}
                        required
                    />

                    {adminLogin ?
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            value={formData.password}
                            error={errors.password}
                            onChange={(e) => handleChange("password", e)}
                            required
                        /> :
                        <TextField
                            label="Secret Code"
                            name="secretCode"
                            type="text"
                            placeholder="Enter Secret Code"
                            value={formData.secretCode}
                            error={errors.secretCode}
                            onChange={(e) => handleChange("secretCode", e)}
                            required
                        />
                    }


                    <div className="flex space-x-5 mt-7">
                        {adminLogin &&
                            <Button
                                label="Signup"
                                // className={`bg-gray-400`}
                                bgAndTextColor="bg-gray-200 text-gray-900"
                                onClick={signup}
                            />
                        }
                        <Button
                            loading={btnLoading}
                            label="Login"
                            type="submit"
                            className={``}
                        />
                    </div>

                </form>
            </div>
        </>
    )
}

export default Login;