import { Outlet, Link } from "react-router-dom";

import styles from "../styles/layouts/PublicLayout.module.css";
import Button from "../components/Button";
export default function PublicLayout() {

  return (
    <div className={styles.layout}>

      {/* NAVBAR */}
      <nav className={styles.navbar}>

        <h1 className={styles.brand}>
          ChurchApp
        </h1>

        <div className={styles.links}>

          <Button
            to="/login"
          >
            Login
          </Button>

          <Button
            to="/register"
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
        &copy; {new Date().getFullYear()} ChurchApp. All rights reserved.
      </footer>

    </div>
  );
}
