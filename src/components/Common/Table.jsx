import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, useNavigate } from "react-router-dom";

// Icons
import { IoIosSearch } from "react-icons/io";

// Components
import Button from "./Button";
import { Popup } from "./Popup";

// Utils
import navLinks from "../../../Utils/navLinks";

// Hooks
import useAdmin from "../../../Hooks/useAdmin";

const Table = ({
    title,
    columns = [],
    apiURL,
    deleteUrl,
    assignData = () => [],
    addClick,
    viewClick,
    editClick,
    limit = 10,
    refreshKey = 0,
    searchPlaceholder = "Search...",
    targetTable,
    showRefresh = true,
    showAdd = true,
    showView = true,
    showEdit = true,
    showDelete = true
}) => {

    const navigate = useNavigate(); // useNavigate()
    const { header, admin, formatDate } = useAdmin(); // useAdmin Hook
    const { openConfirm } = useOutletContext(); // For Access ConfirmDialog

    const [popup, setPop] = useState(null); // popup message
    const [loading, setLoading] = useState(false); // For loader
    const [btnLoading, setBtnLoading] = useState(false); // For Button Loader

    const [data, setData] = useState([]); // Table Data
    const [totalCount, setTotalCount] = useState(0); // Tatal Data Count
    const [currentPage, setCurrentPage] = useState(1); // For Pagination
    const [search, setSearch] = useState(""); // Search Box value

    // For Pagination
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (currentPage - 1) * limit;

    // Get Table Datas From DB
    // const fetchTableData = async () => {
    //     if (!apiURL) return;

    //     setLoading(true);

    //     try {
    //         const { data: res } = await axios.get(
    //             apiURL,
    //             {
    //                 params: {
    //                     id: admin.id,
    //                     role: admin.role,
    //                     search: search,
    //                     skip: skip,
    //                     limit: limit,
    //                 },
    //                 ...header()
    //             }
    //         );

    //         if (res.code === 200) {
    //             setTotalCount(res.data.count);
    //             setData(assignData(res.data.data || []));
    //         } else {
    //             setData([]);
    //             setTotalCount(0);
    //         }
    //     } catch (err) {
    //         setData([]);
    //         // Check if the error is from server (401)
    //         if (err.response && err.response.status === 401) { // Auth error
    //             navigate(navLinks.LOGIN); // redirect to login page
    //         } else {
    //             console.log('Error response:', err.response?.data);
    //             console.log('Status:', err.response?.status);
    //             console.log('Params sent:', {
    //                 id: admin.id,
    //                 role: admin.role,
    //                 search: search,
    //                 skip: skip,
    //                 limit: limit,
    //             });
    //             setPop({ title: "Couldn't able to Fetch Data", type: "error" }); // error popup
    //         }
    //     } finally {
    //         setLoading(false);
    //         setBtnLoading(false)
    //     }
    // };

    const fetchTableData = async () => {
        if (!apiURL) return;
        setLoading(true);

        try {
            const { data: res } = await axios.get(
                apiURL,
                {
                    params: {
                        id: admin.id,
                        role: admin.role,
                        search: search,
                        skip: skip,
                        limit: limit,
                    },
                    ...header(),
                    // Tell axios - don't throw error for any status code
                    // Only throw for network errors
                    validateStatus: (status) => status < 500
                }
            );

            if (res.code === 200) {
                setTotalCount(res.data.count);
                setData(assignData(res.data.data || []));
            } else {
                setData([]);
                setTotalCount(0);
            }

        } catch (err) {
            setData([]);
            if (err.response && err.response.status === 401) {
                navigate(navLinks.LOGIN);
            } else {
                setPop({ title: "Couldn't able to Fetch Data", type: "error" });
            }
        } finally {
            setLoading(false);
            setBtnLoading(false);
        }
    };

    const onManualRefresh = () => {
        setBtnLoading(true)
        setCurrentPage(1);
        fetchTableData();
    };

    useEffect(() => {
        fetchTableData();
    }, [apiURL, currentPage, refreshKey]);

    const onPageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDelete = async (id) => {
        if (!deleteUrl) return;

        openConfirm({
            title: "Delete Data",
            message: "Are you sure you want to Delete this data?.",
            action: async () => {
                try {
                    const { data: res } = await axios.delete(deleteUrl, {
                        headers: header().headers,
                        data: { id, targetTable }
                    });

                    if (res.code === 200) {
                        fetchTableData();
                        setPop({ title: res.message, type: "success" }); // Success popup
                    } else {
                        setPop({ title: res.message, type: "error" }); // error popup
                    }
                } catch (err) {
                    // Check if the error is from server (401)
                    if (err.response && err.response.status === 401) { // Auth error
                        navigate(navLinks.LOGIN); // redirect to login page
                    } else {
                        setPop({ title: "Couldn't able to Delete", type: "error" }); // error popup
                    }
                }
            }
        })
    }

    return (

        <div className="fixed top-14 left-0 lg:left-55 right-0 bottom-0 bg-gray-50 p-4 md:p-6 overflow-y-auto">
            {popup != null && <Popup unmount={() => setPop(null)} tablePopUp={true} title={popup.title} type={popup.type} />}

            {/* ===== Header + Table Wrapper ===== */}
            <div>

                {/* ===== Header ===== */}
                <div className="mb-4">

                    {/* Row 1: Title + Search (lg) + Buttons */}
                    <div className="flex flex-col- lg:flex-row lg:items-center justify-between gap-3">

                        {/* Left Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                            {/* Title */}
                            <div className="flex items-center space-x-2 shrink-0">
                                <h2 className="text-2xl text-sky-800 font-semibold">{title}</h2>
                                <p className="text-xl text-gray-500">{totalCount}</p>
                            </div>

                        </div>

                        {/* Search (VISIBLE ONLY ON LARGE SCREENS) */}
                        <div className="hidden lg:block flex-1 max-w-xl">
                            <div className="relative flex">
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full px-3 py-1.5 pr-10 border border-gray-300 rounded-md text-sm
                                        focus:outline-none focus:ring-1 focus:ring-sky-600"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            fetchTableData();   // Table Fetch
                                        }
                                    }}
                                />
                                <IoIosSearch className="absolute right-0 p-1 rounded-md top-1/2 -translate-y-1/2 transition-all duration-300
                                text-3xl text-gray-500 bg-gray-200 cursor-pointer hover:bg-gray-300 hover:text-white"
                                    onClick={() => fetchTableData()} />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-2 shrink-0">
                            {showRefresh && (
                                <Button
                                    label="Refresh"
                                    className="hover:text-white hover:bg-sky-700 text-sm"
                                    width="20"
                                    rounded="md"
                                    padding="px-4 py-1"
                                    onClick={onManualRefresh}
                                    loading={btnLoading}
                                    iconSize="md"
                                />
                            )}

                            {showAdd && (
                                <Button
                                    label="Add"
                                    className="hover:text-white hover:bg-sky-700 text-sm"
                                    width="20"
                                    rounded="md"
                                    padding="px-4 py-1"
                                    onClick={addClick}
                                />
                            )}
                        </div>
                    </div>

                    {/* Search (SMALL DEVICES ONLY – BELOW TITLE & BUTTONS) */}
                    <div className="block lg:hidden mt-3">
                        <div className="relative flex">
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        fetchTableData();   // Table Fetch
                                    }
                                }}
                                className="w-full px-3 py-1.5 pr-10 border border-gray-300 rounded-md text-sm
                                        focus:outline-none focus:ring-1 focus:ring-sky-600"
                            />
                            <IoIosSearch className="absolute right-0 p-1 rounded-md top-1/2 -translate-y-1/2
                                text-3xl text-gray-500 bg-gray-200"
                                onClick={() => fetchTableData()} />
                        </div>
                    </div>

                </div>

                {/* Loader + Table */}
                {loading ?
                    (
                        <div className="px-4 py-15 text-center text-gray-600">
                            Loading...
                        </div>
                    ) : (
                        < div className="overflow-x-auto px-4- md:py-2">
                            <div className="h-full overflow-y-auto shadow-sm rounded-lg">
                                <table className="w-full border-collapse border border-gray-200 shadow-xl rounded-xl">
                                    <thead className="bg-sky-700 text-white sticky top-0 z-10">
                                        <tr>
                                            {columns.map((col) => (
                                                <th
                                                    key={col.key}
                                                    className="px-4 py-3 text-left text-sm font-medium border-b"
                                                >
                                                    {col.label}
                                                </th>
                                            ))}
                                            <th className="px-4 py-3 text-sm font-medium border-b">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={columns.length + 1}
                                                    className="text-center py-6 text-gray-500"
                                                >
                                                    No data found
                                                </td>
                                            </tr>
                                        ) : (
                                            data.map((row, index) => (
                                                <tr
                                                    key={index}
                                                    className="hover:bg-gray-50 border-b border-gray-200 text-gray-700"
                                                >
                                                    {columns.map((col) => (
                                                        <td
                                                            key={col.key}
                                                            className="px-4 py-3 text-sm"
                                                        >
                                                            {col.key === "sno"
                                                                ? skip + index + 1
                                                                : col.key === "dob" || col.key === "date"
                                                                    ? formatDate(row[col.key])
                                                                    : row[col.key]
                                                            }
                                                        </td>
                                                    ))}

                                                    <td className="px-4 py-3 space-x-2 flex justify-center">
                                                        {showView &&
                                                            <Button
                                                                label="View"
                                                                bgAndTextColor={"bg-green-600 text-white "}
                                                                className={` hover:bg-green-700 text-xs`}
                                                                rounded="md"
                                                                width="20"
                                                                padding="px-2 py-1"
                                                                onClick={() => viewClick(row)}
                                                            />
                                                        }
                                                        {showEdit &&
                                                            <Button
                                                                label="Edit"
                                                                bgAndTextColor={"bg-amber-600 text-white "}
                                                                className={` hover:bg-amber-700 text-xs`}
                                                                rounded="md"
                                                                width="20"
                                                                padding="px-2 py-1"
                                                                onClick={() => editClick(row)}
                                                            />
                                                        }
                                                        {showDelete &&
                                                            <Button
                                                                label="Delete"
                                                                bgAndTextColor={"bg-red-600 text-white "}
                                                                className={` hover:bg-red-700 text-xs`}
                                                                rounded="md"
                                                                width="20"
                                                                padding="px-2 py-1"
                                                                onClick={() => handleDelete(row.id)}
                                                            />
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
            </div>

            {/* Pagination */}
            <div className="bg-cyan-400- flex justify-center items-center p-4 space-x-5 text-sm">
                <Button
                    label="Prev"
                    disabled={currentPage === 1}
                    bgAndTextColor={"bg-sky-700 text-white "}
                    className={` hover:bg-sky-600 text-sm`}
                    rounded="md"
                    width="20"
                    padding="px-2 py-1"
                    onClick={() => onPageChange(currentPage - 1)}
                />

                <span className="text-md font-semibold text-sky-800">
                    Page {currentPage} of {totalPages}
                </span>

                <Button
                    label="Next"
                    disabled={currentPage === totalPages}
                    bgAndTextColor={"bg-sky-700 text-white "}
                    className={` hover:bg-sky-600 text-sm`}
                    rounded="md"
                    width="20"
                    padding="px-2 py-1"
                    onClick={() => onPageChange(currentPage + 1)}
                />
            </div>

        </div >

    );
};

export default Table;
