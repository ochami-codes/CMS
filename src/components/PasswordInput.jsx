import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import "../styles/layout.css";

function getPasswordStrength(password) {
  if (!password) return null;

  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Weak", color: "#ef4444", width: "33%" };
  if (score <= 3) return { label: "Medium", color: "#facc15", width: "66%" };
  return { label: "Strong", color: "#22c55e", width: "100%" };
}

export default function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  error = "",
  showStrength = false
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(null);

  useEffect(() => {
    if (showStrength) {
      setStrength(getPasswordStrength(value));
    }
  }, [value, showStrength]);

  return (
    <div className="input-group">
      {label && <label htmlFor={name}>{label}</label>}

      <div className="password-wrapper">
        <input
          id={name}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={error ? "input-error" : ""}
        />

        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="password-toggle"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && <span className="error-text">{error}</span>}

      {showStrength && strength && (
        <div className="password-strength">
          <div className="strength-bar">
            <div
              className="strength-fill"
              style={{
                width: strength.width,
                backgroundColor: strength.color
              }}
            />
          </div>
          <small>{strength.label}</small>
        </div>
      )}
    </div>
  );
}
