// src/components/Toast.jsx
import React, { useEffect } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        padding: "12px 16px",
        borderRadius: 6,
        color: "#fff",
        backgroundColor: type === "success" ? "#16a34a" : "#dc2626",
        boxShadow: "0 4px 10px rgba(0,0,0,.15)",
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
};

export default Toast;