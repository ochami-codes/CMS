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
      replace: true,
    });
  };

  return (
    <div className={styles.layout}>
      <main className={styles.main}>

        {/* NAVBAR */}
        <header className={styles.navbar}>
          <div className={styles.brand}>
            <span className={styles.brandChurch}>
              Church
            </span>

            <span className={styles.brandApp}>
              App
            </span>
          </div>

          <div className={styles.actions}>
            {user?.email && (
              <span className={styles.email}>
                {user.email}
              </span>
            )}

            <Button
              onClick={handleLogout}
              variant="ghost"
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
