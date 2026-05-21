import { Outlet, Link } from "react-router-dom";

import styles from "../styles/layouts/PublicLayout.module.css";

export default function PublicLayout() {

  return (
    <div className={styles.layout}>

      {/* NAVBAR */}
      <nav className={styles.navbar}>

        <h1 className={styles.brand}>
          ChurchApp
        </h1>

        <div className={styles.links}>

          <Link
            to="/login"
            className="btn btn-secondary btn-sm"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="btn btn-primary btn-sm"
          >
            Register
          </Link>

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
