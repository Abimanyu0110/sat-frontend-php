import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

// Utils
import navLinks from "../../Utils/navLinks";

// Hooks
import useAdmin from "../../Hooks/useAdmin";

const Sidebar = ({ sidebarOpen, setSidebarOpen, openConfirm }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const { admin } = useAdmin();

    const menus = [
        { key: "dashboardAdmin", label: "Dashboard", link: navLinks.DASHBOARD_ADMIN, role: ["ADMIN"] },
        { key: "dashboardTeacher", label: "Dashboard", link: navLinks.DASHBOARD_TEACHER, role: ["TEACHER"] },
        { key: "teacher", label: "Teacher", link: navLinks.TEACHERS_LIST, role: ["ADMIN"] },
        { key: "student", label: "Student", link: navLinks.STUDENTS_LIST, role: ["ADMIN", "TEACHER"] },
        { key: "attendance", label: "Attendance", link: navLinks.ATTENDANCE_LIST, role: ["TEACHER"] },
        { key: "report", label: "Report", link: navLinks.REPORT, role: ["TEACHER", "ADMIN"] }
    ];

    const allowedMenus = menus.filter(menu =>
        menu.role.includes(admin.role)
    );

    const getActiveMenuFromPath = (pathname) => {
        const currentMenu = menus.find(menu => menu.link === pathname);
        return currentMenu?.key || "";
    };

    const [activeMenu, setActiveMenu] = useState(
        getActiveMenuFromPath(location.pathname)
    );

    useEffect(() => {
        setActiveMenu(getActiveMenuFromPath(location.pathname));
    }, [location.pathname]);

    const menuClick = (key, path) => {
        setActiveMenu(key);
        navigate(path);
        setSidebarOpen(false); // ✅ close on mobile
    };

    const handleLogout = () => {
        Cookies.remove("role");
        Cookies.remove("userId");
        Cookies.remove("userName");
        Cookies.remove("accessToken");
        navigate(navLinks.LOGIN);
    };

    return (
        <>
            {/* Backdrop (sm/md only) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={`
        w-55 min-h-screen bg-sky-800 text-white fixed z-50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}>
                {/* Title */}
                <div className="h-14 flex items-center px-4 text-lg font-bold border-b border-sky-200">
                    SAT
                </div>

                <div className="flex flex-col h-[calc(100vh-3.5rem)] justify-between">
                    {/* Menu */}
                    <nav className="mt-4 px-2 space-y-2">
                        {allowedMenus.map((menu) => (
                            <button
                                key={menu.key}
                                onClick={() => menuClick(menu.key, menu.link)}
                                className={`
                  w-full text-left px-4 py-2 text-sm rounded-xl transition cursor-pointer
                  ${activeMenu === menu.key
                                        ? "bg-sky-600"
                                        : "hover:bg-sky-700"}
                `}
                            >
                                {menu.label}
                            </button>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="px-2 pb-20 lg:pb-4 bg-amber-50-">
                        <button
                            onClick={() =>
                                openConfirm({
                                    title: "Logout",
                                    message: "Are you sure you want to Logout?.",
                                    action: handleLogout
                                })
                            }
                            className="
                                w-full text-left px-4 py-2 text-sm
                                bg-sky-50 text-sky-950 cursor-pointer
                                hover:bg-sky-100 rounded-xl transition
                            "
                        >
                            Logout
                        </button>
                    </div>
                </div>

            </aside>
        </>
    );
};

export default Sidebar;
