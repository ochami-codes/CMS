// src/pages/Home.jsx
import { Link } from "react-router-dom";
import "../styles/pages.css";
import { FaUsers, FaMoneyBillWave, FaBullhorn, FaLock, FaUserPlus, FaEnvelope, FaSignInAlt } from "react-icons/fa";

export default function Home() {
  return (
    <div className="container home-container">

      {/* ================= Hero ================= */}
      <header className="card home-hero text-center">
        <h1 className="home-hero-title">Church management, made simple</h1>
        <p className="home-hero-subtitle">
          Manage members, departments, finances, and announcements — all in one place.
        </p>

        <div className="home-buttons">
          <Link to="/login" className="btn btn-primary">Sign In</Link>
          <Link to="/register" className="btn btn-secondary">Get Started</Link>
        </div>
      </header>

      {/* ================= How It Works ================= */}
      <section className="home-section">
        <h2 className="section-title">How It Works</h2>
        <div className="features-grid features-grid-3">
          <div className="feature-card feature-gradient-indigo">
            <div className="feature-icon-title">
              <FaUserPlus size={24} />
              <h3 className="feature-title">1. Register</h3>
            </div>
            <p>Create an account by clicking the <strong>Get Started</strong> button.</p>
          </div>

          <div className="feature-card feature-gradient-green">
            <div className="feature-icon-title">
              <FaEnvelope size={24} />
              <h3 className="feature-title">2. Verify Email</h3>
            </div>
            <p>Check your inbox and click the verification link we send you.</p>
          </div>

          <div className="feature-card feature-gradient-yellow">
            <div className="feature-icon-title">
              <FaSignInAlt size={24} />
              <h3 className="feature-title">3. Log In</h3>
            </div>
            <p>Once verified, sign in and access your church dashboard.</p>
          </div>
        </div>
      </section>

      {/* ================= Features ================= */}
      <section className="home-section">
        <h2 className="section-title">Features</h2>
        <div className="features-grid features-grid-4">
          <div className="feature-card feature-gradient-indigo">
            <div className="feature-icon-title">
              <FaUsers size={24} />
              <h3 className="feature-title">Departments</h3>
            </div>
            <p>Youth, Children, Sabbath School & more.</p>
          </div>

          <div className="feature-card feature-gradient-green">
            <div className="feature-icon-title">
              <FaMoneyBillWave size={24} />
              <h3 className="feature-title">Treasury</h3>
            </div>
            <p>Track tithe, offerings, and church funds.</p>
          </div>

          <div className="feature-card feature-gradient-yellow">
            <div className="feature-icon-title">
              <FaBullhorn size={24} />
              <h3 className="feature-title">Announcements</h3>
            </div>
            <p>Share updates with the whole church.</p>
          </div>

          <div className="feature-card feature-gradient-red">
            <div className="feature-icon-title">
              <FaLock size={24} />
              <h3 className="feature-title">Roles & Security</h3>
            </div>
            <p>Admins, pastors, and members — securely managed.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
