import React, { useEffect, useState } from "react";

const Toaster = ({
  message,
  type,
  onClose,
  show,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  show: boolean;
}) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!show) {
      setExiting(true);
      const timer = setTimeout(() => {
        setExiting(false);
        onClose();
      }, 400);
      return () => clearTimeout(timer);
    }
    setExiting(false);
  }, [show, onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-white transition-all duration-400 transform ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } ${
        show && !exiting
          ? "translate-x-0 opacity-100 pointer-events-auto"
          : "translate-x-full opacity-0 pointer-events-none"
      }`}
      role="alert"
    >
      <div className="flex items-center">
        <span className="mr-2 font-semibold">
          {type === "success" ? "Success:" : "Error:"}
        </span>
        <span>{message}</span>
        <button
          className="ml-4 text-white/80 hover:text-white"
          onClick={onClose}
          aria-label="Close notification"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toaster;
