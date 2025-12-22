// src/layouts/PublicLayout.jsx
import { Outlet, Link } from 'react-router-dom';
import "../styles/global.css";
export default function PublicLayout() {
  return (
    <div>
      {/* Navbar */}
      <nav style={{ padding: '1rem 2rem', backgroundColor: '#4f46e5', color: '#fff' }}>
        <h1 style={{ display: 'inline' }}>ChurchApp</h1>
        <div style={{ float: 'right' }}>
          <Link to="/login" style={{ marginRight: '1rem', color: '#fff' }}>Login</Link>
          <Link to="/register" style={{ color: '#fff' }}>Register</Link>
        </div>
      </nav>

      {/* Page Content */}
      <main className="container" style={{ padding: '2rem 0' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f3f4f6', marginTop: '2rem' }}>
        &copy; {new Date().getFullYear()} ChurchApp. All rights reserved.
      </footer>
    </div>
  );
}