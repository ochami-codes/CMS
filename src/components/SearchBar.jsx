import styles from "../styles/components/SearchBar.module.css";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  icon
}) {
  return (
    <div className={styles.wrapper}>

      {icon && (
        <div className={styles.icon}>
          {icon}
        </div>
      )}

      <input
        className={styles.input}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {value && onClear && (
        <button
          className={styles.clear}
          onClick={onClear}
          type="button"
        >
          ✕
        </button>
      )}

    </div>
  );
}
