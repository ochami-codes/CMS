import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "../styles/components/PasswordInput.module.css";

/* strength logic stays here */
function getPasswordStrength(password) {
  if (!password) return null;

  let score = 0;

  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    return { label: "Weak", color: "#ef4444", width: "33%" };
  }

  if (score <= 3) {
    return { label: "Medium", color: "#facc15", width: "66%" };
  }

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
    <div className={styles.group}>

      {label && (
        <label
          htmlFor={name}
          className={styles.label}
        >
          {label}
        </label>
      )}

      {/* input wrapper */}
      <div className={styles.wrapper}>

        <input
          id={name}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={styles.input}
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(p => !p)
          }
          className={styles.toggle}
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>

      </div>

      {error && (
        <span className={styles.error}>
          {error}
        </span>
      )}

      {showStrength && strength && (
        <div className={styles.strength}>

          <div className={styles.bar}>

            <div
              className={styles.fill}
              style={{
                width: strength.width,
                backgroundColor: strength.color
              }}
            />

          </div>

          <small className={styles.text}>
            {strength.label}
          </small>

        </div>
      )}

    </div>
  );
}
