import { useState, useEffect } from "react"

// Components 
import { Modal } from "../../components/Common/Modal";
import Table from "../../components/Common/Table";

// Pages
import ManageTeacher from "./ManageTeacher";
import ViewTeacher from "./ViewTeacher";

// Utils
import API from "../../../Utils/API";

const TeachersList = () => {

    const [refreshKey, setRefreshKey] = useState(0);
    const [popupManage, setPopupManage] = useState({ show: false, id: 0 })
    const [popupView, setPopupView] = useState({ show: false, id: 0 })

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);     // refresh table
    };

    return (
        <>
            {/* Add / Edit - Modal */}
            <Modal
                show={popupManage.show}
                closePopup={() => setPopupManage({ show: false })}
            >
                <ManageTeacher onSuccess={handleSuccess} id={popupManage.id} />
            </Modal>

            {/* View - Modal */}
            <Modal
                show={popupView.show}
                closePopup={() => setPopupView({ show: false })}
            >
                <ViewTeacher id={popupView.id} />
            </Modal>

            <div className="fixed top-14 left-0 lg:left-55  right-0 bottom-0">

                <Table
                    title="Teachers"
                    apiURL={API.HOST + API.TEACHERS_LIST}
                    limit={10}
                    deleteUrl={API.HOST + API.DELETE_DATA}
                    targetTable={"admins"}
                    searchPlaceholder="Search name, email, gender, class, section or subject"
                    refreshKey={refreshKey}
                    columns={[
                        { label: "S.no", key: "sno" },
                        { label: "Name", key: "name" },
                        { label: "Email", key: "email" },
                        { label: "Gender", key: "gender" },
                        { label: "Class", key: "class" },
                        { label: "Section", key: "section" },
                        { label: "Subject", key: "subject" },
                    ]}
                    assignData={(rows) =>
                        rows.map((r) => ({
                            id: r.id,
                            name: r.firstName + " " + r.lastName,
                            email: r.email,
                            gender: r.gender,
                            class: r.class,
                            section: r.section,
                            subject: r.subject,
                        }))
                    }
                    addClick={() => setPopupManage({ show: true })}
                    viewClick={(row) => setPopupView({ show: true, id: row.id })}
                    editClick={(row) => setPopupManage({ show: true, id: row.id })}
                />
            </div>

        </>
    )
}

export default TeachersList;