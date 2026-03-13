const TextField = ({
    label,
    name,
    type = "text",
    placeholder = "",
    value,
    onChange = () => { },
    error = "",
    required = false,
    disabled = false,
    flex = "flex flex-col",
}) => {
    const isRow = flex.includes("flex-row");

    return (
        <div className={`${flex} gap-2 w-full`}>
            {/* Label */}
            {label && (
                <label
                    htmlFor={name}
                    className={`text-sm font-medium text-gray-600 ${isRow ? "w-full md:w-1/3" : "w-full"
                        }`}
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div
                className={`flex flex-col ${isRow ? "w-full md:w-2/3" : "w-full"
                    }`}
            >
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    disabled={disabled}
                    className={`px-3 py-2 text-gray-700 border rounded-md outline-none transition
                        ${error
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-sky-700"}
                        disabled:bg-gray-100 text-sm`}
                />

                {error && (
                    <p className="text-xs mt-0.5 ml-0.5 text-red-500">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default TextField;

