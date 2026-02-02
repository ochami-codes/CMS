// src/components/Loader.jsx
export default function Loader({ message = "Loading..." }) {
  return (
    <div
      className="loader-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(248, 249, 250, 0.85)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        className="loader"
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #4f46e5",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <p
        style={{
          marginTop: "1rem",
          fontSize: "1.2rem",
          color: "#4f46e5",
          fontWeight: 500,
        }}
      >
        {message}
      </p>
    </div>
  );
}
