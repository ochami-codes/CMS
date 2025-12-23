// src/components/Button.jsx
import "../styles/global.css";
import "./button.css";

export default function Button({ children, onClick, type = "button", disabled = false }) {
  return (
    <button
      className="btn"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

