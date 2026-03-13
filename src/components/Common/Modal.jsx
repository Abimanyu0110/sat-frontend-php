import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

export const Modal = ({
  children,
  show,
  closePopup,
  className = "",
}) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
    }
  }, [show]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      closePopup();
    }, 200); // match animation duration
  };

  if (!show && !visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      {/* Modal Box */}
      <div
        className={`
          relative w-full max-w-lg
          sm:max-w-xl md:max-w-2xl lg:max-w-3xl
          bg-white rounded-lg shadow-xl
          transform transition-all duration-200
          ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-2 lg:right-5 text-2xl rounded-lg bg-gray-100 hover:bg-gray-200 p-1 text-gray-500 cursor-pointer hover:text-gray-800"
        >
          <IoCloseOutline />
        </button>

        {/* Content */}
        <div className={`p-5 max-h-[80vh] overflow-y-auto ${className}`}>
          {React.cloneElement(children, { closePopup: handleClose })}
        </div>
      </div>
    </div>
  );
};