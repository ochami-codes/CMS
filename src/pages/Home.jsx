import { Link } from "react-router-dom";
import "../styles/global.css";

export default function Home() {
  return (
    <div className="home-container">
      {/* ================= Hero ================= */}
      <header className="home-hero">
        <h1>Church management, made simple</h1>
        <p>
          Manage members, departments, finances, and announcements — all in one
          place.
        </p>

        <div className="home-buttons">
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Get Started
          </Link>
        </div>
      </header>

      {/* ================= How It Works ================= */}
      <section className="home-features">
        <div className="features-grid">
          <div className="feature-card">
            <h3>1. Register</h3>
            <p>
              Create an account by clicking the <strong>Get Started</strong>{" "}
              button.
            </p>
          </div>

          <div className="feature-card">
            <h3>2. Verify Email</h3>
            <p>
              Check your email inbox and click the verification link we send you.
            </p>
          </div>

          <div className="feature-card">
            <h3>3. Log In</h3>
            <p>
              Once verified, sign in and access your church dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* ================= Features ================= */}
      <section className="home-features">
        <div className="features-grid">
          <div className="feature-card">
            <h3>Departments</h3>
            <p>Youth, Children, Sabbath School & more.</p>
          </div>

          <div className="feature-card">
            <h3>Treasury</h3>
            <p>Track tithe, offerings, and church funds.</p>
          </div>

          <div className="feature-card">
            <h3>Announcements</h3>
            <p>Share updates with the whole church.</p>
          </div>

          <div className="feature-card">
            <h3>Roles & Security</h3>
            <p>Admins, pastors, and members — securely managed.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
