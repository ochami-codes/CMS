// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container home-container mt-16">
      {/* ================= Hero ================= */}
      <header className="card home-hero text-center p-8 space-y-4">
        <h1 className="text-3xl font-bold">Church management, made simple</h1>
        <p className="text-gray-700 text-lg">
          Manage members, departments, finances, and announcements — all in one place.
        </p>

        <div className="home-buttons flex justify-center gap-4 mt-4">
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Get Started
          </Link>
        </div>
      </header>

      {/* ================= How It Works ================= */}
      <section className="home-features mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">How It Works</h2>
        <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="feature-card card p-6">
            <h3 className="font-semibold mb-2 text-lg">1. Register</h3>
            <p className="text-gray-700 text-sm">
              Create an account by clicking the <strong>Get Started</strong> button.
            </p>
          </div>

          <div className="feature-card card p-6">
            <h3 className="font-semibold mb-2 text-lg">2. Verify Email</h3>
            <p className="text-gray-700 text-sm">
              Check your email inbox and click the verification link we send you.
            </p>
          </div>

          <div className="feature-card card p-6">
            <h3 className="font-semibold mb-2 text-lg">3. Log In</h3>
            <p className="text-gray-700 text-sm">
              Once verified, sign in and access your church dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* ================= Features ================= */}
      <section className="home-features mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Features</h2>
        <div className="features-grid grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="feature-card card p-6">
            <h3 className="font-semibold mb-2 text-lg">Departments</h3>
            <p className="text-gray-700 text-sm">Youth, Children, Sabbath School & more.</p>
          </div>

          <div className="feature-card card p-6">
            <h3 className="font-semibold mb-2 text-lg">Treasury</h3>
            <p className="text-gray-700 text-sm">Track tithe, offerings, and church funds.</p>
          </div>

          <div className="feature-card card p-6">
            <h3 className="font-semibold mb-2 text-lg">Announcements</h3>
            <p className="text-gray-700 text-sm">Share updates with the whole church.</p>
          </div>

          <div className="feature-card card p-6">
            <h3 className="font-semibold mb-2 text-lg">Roles & Security</h3>
            <p className="text-gray-700 text-sm">Admins, pastors, and members — securely managed.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
