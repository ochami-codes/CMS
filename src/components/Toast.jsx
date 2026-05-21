import { useEffect } from "react";
import styles from "../styles/components/Toast.module.css";

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 3000
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`${styles.toast} ${styles[type]}`}
    >
      {message}
    </div>
  );
}
