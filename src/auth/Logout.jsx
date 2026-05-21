import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import styles from "../styles/pages/Logout.module.css";

export default function Logout() {

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      await logout();
      navigate("/login", { replace: true });
    };

    doLogout();
  }, [logout, navigate]);

  return (
    <div className={styles.container}>

      <div className={styles.card}>

        <h2 className={styles.title}>
          Logging out…
        </h2>

        <div className={styles.spinner} />

        <p className={styles.text}>
          Please wait while we sign you out.
        </p>

      </div>

    </div>
  );
}
