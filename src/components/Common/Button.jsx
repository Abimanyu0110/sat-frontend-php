import { CgSpinnerTwoAlt } from "react-icons/cg";

const Button = ({
    label,
    onClick,
    type = "button",
    disabled = false,
    bgAndTextColor = "bg-sky-700 text-white",
    rounded = "md",
    width = "full",
    padding = "px-4 py-2",
    loading = false,
    iconSize = "2xl",
    className
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${bgAndTextColor} ${padding} rounded-${rounded} hover:opacity-90 
            transition disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer w-${width} ${className}
            flex items-center justify-center`}
        >
            {loading ? (
                <CgSpinnerTwoAlt className={`animate-spin text-${iconSize}`} />
            ) : (
                label
            )}
        </button>
    );
};

export default Button;
