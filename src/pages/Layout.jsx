import { useState } from "react";
import { Outlet } from "react-router-dom";

// Pages
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

// Components
import ConfirmDialog from "../components/Common/ConfirmDialog";

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false); // SideBar

    // Confirm dialog
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmTitle, setConfirmTitle] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");

    const openConfirm = ({ action, title, message }) => {
        setConfirmAction(() => action);
        setConfirmTitle(title);
        setConfirmMessage(message);
        setShowConfirm(true);
    };

    const handleYes = () => {
        confirmAction?.();
        setShowConfirm(false);
    };

    return (
        <>

            <div className="flex min-h-screen bg-white">
                {/* Sidebar */}
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    openConfirm={openConfirm}
                />

                {/* Main */}
                <div className="flex flex-1 flex-col bg-gray-50">
                    <Navbar setSidebarOpen={setSidebarOpen} />

                    <main className="flex-1 bg-gray-50 p-4 mt-14 lg:ml-55">
                        <Outlet context={{ openConfirm }} />
                    </main>
                </div>
            </div>

            {/* Comfirm Dialog */}
            {showConfirm && (
                <ConfirmDialog
                    isOpen={showConfirm}
                    title={confirmTitle}
                    message={confirmMessage}
                    onYes={handleYes}
                    onNo={() => setShowConfirm(false)}
                />
            )}
        </>
    );
}

export default Layout;
