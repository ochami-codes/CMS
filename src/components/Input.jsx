// src/components/Input.jsx
import "../styles/global.css";

export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  error = ""
}) {
  return (
    <div className="input-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={error ? "input-error" : ""}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}

