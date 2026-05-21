import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import styles from "../styles/layouts/OnboardingLayout.module.css";

export default function OnboardingLayout() {

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();

    navigate("/login", {
      replace: true
    });
  };

  return (
    <div className={styles.layout}>

      {/* MAIN */}
      <main className={styles.main}>

        {/* NAVBAR */}
        <header className={styles.navbar}>

          <h3 className={styles.title}>
            Welcome
          </h3>

          <div className={styles.actions}>

            <span className={styles.email}>
              {user?.email}
            </span>

            <Button
              onClick={handleLogout}
              >
              Logout
            </Button>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <section className={styles.page}>
          <Outlet />
        </section>

      </main>

    </div>
  );
}
