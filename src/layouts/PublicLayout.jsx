// src/layouts/PublicLayout.jsx
import { Outlet, Link } from "react-router-dom";
import "../styles/layout.css";
export default function PublicLayout() {
  return (
    <div className="public-layout">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="navbar-brand">ChurchApp</h1>
        <div className="navbar-links">
          <Link to="/login" className="btn btn-secondary btn-sm">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Register
          </Link>
        </div>
      </nav>

      {/* Page Content */}
      <main className="container">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} ChurchApp. All rights reserved.
      </footer>
    </div>
  );
}
