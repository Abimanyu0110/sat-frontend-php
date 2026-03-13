import Cookies from "js-cookie";

export default function useAdmin() {

    const header = () => ({
        headers: {
            "Authorization": `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
        }
    });

    const admin = {
        id: Cookies.get("userId"),
        userId: Cookies.get("userId"),
        userName: Cookies.get("userName"),
        role: Cookies.get("role")
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const toLocalDate = (isoDate) => {
        const d = new Date(isoDate);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    return { header, admin, formatDate, toLocalDate };
}