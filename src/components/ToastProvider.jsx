import React, {
  createContext,
  useContext,
  useState,
  useCallback
} from "react";

import Toast from "./Toast";
import styles from "../styles/components/Toast.module.css";

const ToastContext = createContext();

export const useToast = () =>
  useContext(ToastContext);

export const ToastProvider = ({
  children
}) => {
  const [toasts, setToasts] = useState([]);

 const showToast = useCallback(
  (
    message,
    options = {}
  ) => {
    const {
      type = "success",
      duration = 3000,
    } = options;

    const id = crypto.randomUUID();

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
        duration,
      },
    ]);

    return id;
  },
  []
);

  const removeToast = useCallback((id) => {
    setToasts(prev =>
      prev.filter(t => t.id !== id)
    );
  }, []);

  return (
    <ToastContext.Provider
      value={{ showToast, removeToast }}
    >
      {children}

      <div className={styles.container}>
        {toasts.map(t => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            duration={t.duration}
            onClose={() =>
              removeToast(t.id)
            }
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
