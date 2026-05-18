// src/pages/Home.jsx
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaMoneyBillWave,
  FaBullhorn,
  FaLock,
  FaUserPlus,
  FaEnvelope,
  FaSignInAlt,
  FaChurch,
  FaClipboardList,
} from "react-icons/fa";

import "../styles/home.css";

export default function Home() {
  return (
    <div className="home-container">

      {/* HERO */}
      <section className="home-hero">

        <div className="hero-badge">
          <FaChurch />
          Built for churches
        </div>

        <h1>
          Manage your church
          <span> simply & securely</span>
        </h1>

        <p>
          Membership records, departments, treasury,
          announcements, and church roles —
          all in one platform.
        </p>

        <div className="home-buttons">
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>

          <Link to="/login" className="btn btn-outline">
            Sign In
          </Link>
        </div>

        <div className="hero-stats">
          <div>
            <strong>Members</strong>
            <span>Records & transfers</span>
          </div>

          <div>
            <strong>Departments</strong>
            <span>Manage ministries</span>
          </div>

          <div>
            <strong>Treasury</strong>
            <span>Track finances</span>
          </div>
        </div>

      </section>


      {/* HOW IT WORKS */}
      <section>

        <h2 className="section-title">
          Getting started is easy
        </h2>

        <div className="features-grid">

          <div className="feature-card">
            <FaUserPlus />
            <h3>Create account</h3>
            <p>Register your church profile.</p>
          </div>

          <div className="feature-card">
            <FaEnvelope />
            <h3>Verify email</h3>
            <p>Confirm ownership securely.</p>
          </div>

          <div className="feature-card">
            <FaSignInAlt />
            <h3>Start managing</h3>
            <p>Access your dashboard instantly.</p>
          </div>

        </div>

      </section>


      {/* FEATURES */}
      <section>

        <h2 className="section-title">
          Everything churches need
        </h2>

        <div className="features-grid">

          <div className="feature-card">
            <FaClipboardList />
            <h3>Church Clerk</h3>
            <p>
              Membership registers,
              baptisms, transfers,
              missing members.
            </p>
          </div>

          <div className="feature-card">
            <FaUsers />
            <h3>Departments</h3>
            <p>
              Youth, Sabbath School,
              Children, Music & more.
            </p>
          </div>

          <div className="feature-card">
            <FaMoneyBillWave />
            <h3>Treasury</h3>
            <p>
              Track offerings,
              expenses and funds.
            </p>
          </div>

          <div className="feature-card">
            <FaBullhorn />
            <h3>Announcements</h3>
            <p>
              Reach the whole church.
            </p>
          </div>

          <div className="feature-card">
            <FaLock />
            <h3>Role Permissions</h3>
            <p>
              Pastor, elder,
              clerk, member access.
            </p>
          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="cta-section">

        <h2>
          Ready to organize your church?
        </h2>

        <p>
          Start using the platform today.
        </p>

        <Link
          to="/register"
          className="btn btn-primary"
        >
          Create Account
        </Link>

      </section>

    </div>
  );
}
