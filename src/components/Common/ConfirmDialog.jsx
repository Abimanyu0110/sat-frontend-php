import Button from "./Button";

const ConfirmDialog = ({
    isOpen,
    title = "Are you sure?",
    message = "Do you want to continue?",
    onYes,
    onNo
}) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-150 px-10">
            <div className="bg-white w-full max-w-sm rounded-lg shadow-xl border border-gray-200 p-6">

                <h2 className="text-lg text-sky-800 font-semibold mb-2">
                    {title}
                </h2>

                <p className="text-gray-600 mb-6">
                    {message}
                </p>

                <div className="flex justify-end gap-3">
                    <Button
                        label="No"
                        className={`h-10`}
                        onClick={onNo}
                        bgAndTextColor="bg-gray-200 text-gray-900"
                    />

                    <Button
                        label="Yes"
                        className={`h-10`}
                        onClick={onYes}
                    />
                </div>

            </div>
        </div>
    );
};

export default ConfirmDialog;
