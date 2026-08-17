import { Outlet } from "react-router-dom";

import styles from "../styles/layouts/PublicLayout.module.css";
import Button from "../components/Button";

export default function PublicLayout() {
  return (
    <div className={styles.layout}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.brand}>
          <span className={styles.brandChurch}>
            Church
          </span>
          <span className={styles.brandApp}>
            App
          </span>
        </div>

        <div className={styles.links}>
          <Button
            to="/login"
            size="md"
            variant="ghost"
          >
            Login
          </Button>

          <Button
            to="/register"
            size="md"
            variant="primary"
          >
            Register
          </Button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} ChurchApp.
        All rights reserved.
      </footer>
    </div>
  );
}
