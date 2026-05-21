import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import styles from "../styles/components/Navbar.module.css";

export default function Navbar({
  title = "Dashboard"
}) {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();

    navigate("/login", {
      replace: true
    });
  };

  return (
    <div className={styles.navbar}>

      <h3 className={styles.title}>
        {title}
      </h3>

      <div className={styles.right}>

        <span className={styles.email}>
          {user?.email}
        </span>

        <button
          className={styles.logout}
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}
