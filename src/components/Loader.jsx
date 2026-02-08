// src/components/Loader.jsx
export default function Loader({ message = "Loading..." }) {
  return (
    <div className="loader-overlay">
      <div className="loader-card">
        <div className="loader"></div>
        <p className="loader-text">{message}</p>
      </div>
    </div>
  );
}
