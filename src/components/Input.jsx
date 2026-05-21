import styles from "../styles/components/Input.module.css";

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
    <div className={styles.group}>

      {label && (
        <label
          htmlFor={name}
          className={styles.label}
        >
          {label}
        </label>
      )}

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          ${styles.input}
          ${error ? styles.errorInput : ""}
        `}
      />

      {error && (
        <span className={styles.errorText}>
          {error}
        </span>
      )}

    </div>
  );
}
