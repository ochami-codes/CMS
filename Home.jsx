// src/pages/Home.jsx
import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="home-container">
      <header className="home-hero">
        <h1>Welcome to ChurchApp</h1>
        <p>Your church management, simplified and digital.</p>
        <div className="home-buttons">
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/register" className="btn btn-secondary">Register</Link>
        </div>
      </header>

      <section className="home-features">
        <h2>Features</h2>
        <ul>
          <li>Manage Youth & Children Departments</li>
          <li>Treasury tracking & reports</li>
          <li>Church-wide announcements</li>
          <li>Pastor and Admin dashboards</li>
          <li>Secure login & user roles</li>
        </ul>
      </section>
    </div>
  );
}