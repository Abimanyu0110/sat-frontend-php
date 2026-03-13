const Dropdown = ({
    label,
    name,
    value,
    onChange = () => { },
    options = [],
    required = false,
    disabled = false,
    error = "",
    flex = "flex flex-col",
}) => {
    const isRow = flex.includes("flex-row");

    return (
        <div className={`${flex} gap-1 w-full`}>
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
                <select
                    id={name}
                    name={name}
                    value={value} // can be ""
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    required={required}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-sky-700 text-sm"
                >
                    {/* Default option */}
                    <option value="">Select</option>

                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="text-xs mt-0.5 ml-0.5 text-red-500">
                        {error}
                    </p>
                )}
            </div>

        </div>
    );
};

export default Dropdown;
