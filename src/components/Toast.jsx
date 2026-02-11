// src/components/Toast.jsx
import React, { useEffect } from "react";
import "../styles/layout.css";
const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast ${type === "success" ? "toast-success" : "toast-error"}`}>
      {message}
    </div>
  );
};

export default Toast;
