// src/pages/settings/profiles/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ProfileAPI, AuthAPI } from "../../../utils/api";
import ProfileForm from "./ProfileForm";
import SummaryChart from "./SummaryChart";
import { Link, useNavigate } from "react-router-dom";

// Lucide Icons
import { User, Mail, Phone, Edit3, Lock } from "lucide-react";

export default function ProfilePage() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [localProfile, setLocalProfile] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showChangePw, setShowChangePw] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    if (!profile) return;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const res = await ProfileAPI.get();
        setLocalProfile(res.profile || null);
        setContributions(res.contributions || []);
      } catch (err) {
        setMessage(err?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [profile]);

  const handleUpdate = async (updates) => {
    setLoading(true);
    setMessage("");
    try {
      await ProfileAPI.update(updates);
      setLocalProfile((prev) => ({ ...prev, ...updates }));
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");

    if (!newPassword || !confirmPassword) {
      setPwError("Both fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("Password must be at least 6 characters");
      return;
    }

    setPwLoading(true);
    try {
      await AuthAPI.changePassword({ newPassword });
      navigate("/profile/change-password-success", { state: { fromProfile: true } });
    } catch (err) {
      setPwError(err?.message || "Failed to update password");
    } finally {
      setPwLoading(false);
    }
  };

  const Message = ({ type = "success", children }) => {
    const className = type === "success" ? "message-success" : "message-error";
    return (
      <div className={`card ${className}`}>
        <p>{children}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <main className="page-container">
        <section className="page-card">Loading profile…</section>
      </main>
    );
  }

  if (!localProfile) {
    return (
      <main className="page-container">
        <section className="page-card">Profile not found.</section>
      </main>
    );
  }

  return (
    <main className="page-container">

      {/* ROLE REQUEST */}
      <section className="page-card">
        <h2 className="card-title">Role Requests</h2>
        <p className="text-muted">
          Apply for leadership or ministry roles and track approval status.
        </p>
        <Link to="/myrolerequest" className="btn btn-primary">
          View / Submit Role Request
        </Link>
      </section>

      {/* MY ACCOUNT */}
      <section className="page-card">
        <h2 className="card-title"><User /> My Account</h2>
        <p className="text-muted">Your basic account information.</p>

        <div className="profile-info">
          <div className="profile-item">
            <User className="icon" />
            <div>
              <p className="label">Full Name</p>
              <p className="value">{localProfile.full_name}</p>
            </div>
          </div>

          <div className="profile-item">
            <Mail className="icon" />
            <div>
              <p className="label">Email Address</p>
              <p className="value">{localProfile.email}</p>
            </div>
          </div>

          <div className="profile-item">
            <Phone className="icon" />
            <div>
              <p className="label">Phone Number</p>
              <p className="value">{localProfile.phone || "Not provided"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* UPDATE PROFILE */}
      <section className="page-card">
        <h2 className="card-title"><Edit3 /> Update Profile</h2>
        <p className="text-muted">Update your personal details below.</p>

        {message && (
          <Message
            type={message.toLowerCase().includes("success") ? "success" : "error"}
          >
            {message}
          </Message>
        )}

        <ProfileForm
          profile={localProfile}
          onUpdate={handleUpdate}
          loading={loading}
        />
      </section>

      {/* CHANGE PASSWORD */}
      <section className="page-card">
        <div
          onClick={() => setShowChangePw((v) => !v)}
          className="cursor-pointer"
        >
          <h2 className="card-title"><Lock /> Change Password {showChangePw ? "▲" : "▼"}</h2>
          <p className="text-muted">Click to {showChangePw ? "hide" : "update"} your account password.</p>
        </div>

        {showChangePw && (
          <form onSubmit={handleChangePassword} className="form-stack">
            <input
              type="password"
              className="input-field"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              className="input-field"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {pwError && <Message type="error">{pwError}</Message>}

            <button type="submit" className="btn btn-primary w-full" disabled={pwLoading}>
              {pwLoading ? "Updating…" : "Update Password"}
            </button>
          </form>
        )}
      </section>

      {/* CONTRIBUTIONS */}
      {contributions && (
        <section className="stats-grid">
          <div className="page-card">
            <h3 className="card-subtitle">Contributions</h3>
            <ul className="stats-list">
              <li>Tithes: KES {contributions.tithes}</li>
              <li>Offerings: KES {contributions.offerings}</li>
              <li>Camp Offerings: KES {contributions.campOfferings}</li>
              <li>Church Development: KES {contributions.churchDevelopment}</li>
            </ul>
          </div>

          <div className="page-card">
            <h3 className="card-subtitle">Contributions Breakdown</h3>
            <div className="chart-container">
              <SummaryChart contributions={contributions} />
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
