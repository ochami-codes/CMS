// components/Select.jsx

import styles from "../styles/components/Select.module.css";

export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error,
  required = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={styles.label}
        >
          {label}
          {required && " *"}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`${styles.select} ${
          error ? styles.error : ""
        }`}
        {...props}
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className={styles.errorText}>
          {error}
        </p>
      )}
    </div>
  );
}