// src/components/Loader.jsx
import "./loader.css";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}