// src/pages/settings/profiles/ProfilePage.jsx
import { useEffect, useState } from "react";
import { ProfileAPI, AuthAPI } from "../../../utils/api";
import ProfileForm from "./ProfileForm";
import SummaryChart from "./SummaryChart";
import { Link, useNavigate } from "react-router-dom";

// Lucide Icons
import { User, Mail, Phone, Edit3, Lock } from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [contributions, setContributions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showChangePw, setShowChangePw] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");

  /* -------------------------------
     Load profile (source of truth)
  ------------------------------- */
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const res = await ProfileAPI.get();

        setProfile(res.profile || null);

        // Normalize contributions for UI & chart
        const giving = {
          tithes: 0,
          offerings: 0,
          campOfferings: 0,
          churchDevelopment: 0,
        };

        (res.contributions || []).forEach((item) => {
          switch (item.fund_name) {
            case "Tithes":
              giving.tithes += item.total_amount;
              break;
            case "Offerings":
              giving.offerings += item.total_amount;
              break;
            case "Camp Offerings":
              giving.campOfferings += item.total_amount;
              break;
            case "Church Development":
              giving.churchDevelopment += item.total_amount;
              break;
            default:
              break;
          }
        });

        setContributions(giving);
      } catch (err) {
        setMessage(err?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* -------------------------------
     Update profile
  ------------------------------- */
  const handleUpdate = async (updates) => {
    setLoading(true);
    setMessage("");
    try {
      await ProfileAPI.update(updates);
      setProfile((prev) => ({ ...prev, ...updates }));
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------
     Change password
  ------------------------------- */
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
      navigate("/profile/change-password-success", {
        state: { fromProfile: true },
      });
    } catch (err) {
      setPwError(err?.message || "Failed to update password");
    } finally {
      setPwLoading(false);
    }
  };

  /* -------------------------------
     Message component
  ------------------------------- */
  const Message = ({ type = "success", children }) => (
    <div className={`card ${type === "success" ? "message-success" : "message-error"}`}>
      <p>{children}</p>
    </div>
  );

  /* -------------------------------
     Guards
  ------------------------------- */
  if (loading) {
    return (
      <main className="page-container">
        <section className="page-card">Loading profile…</section>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="page-container">
        <section className="page-card">Profile not found.</section>
      </main>
    );
  }

  /* -------------------------------
     Render
  ------------------------------- */
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
        <h2 className="card-title">
          <User /> My Account
        </h2>
        <p className="text-muted">Your basic account information.</p>

        <div className="profile-info">
          <div className="profile-item">
            <User className="icon" />
            <div>
              <p className="label">Full Name</p>
              <p className="value">{profile.full_name}</p>
            </div>
          </div>

          <div className="profile-item">
            <Mail className="icon" />
            <div>
              <p className="label">Email Address</p>
              <p className="value">{profile.email}</p>
            </div>
          </div>

          <div className="profile-item">
            <Phone className="icon" />
            <div>
              <p className="label">Phone Number</p>
              <p className="value">{profile.phone || "Not provided"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* UPDATE PROFILE */}
      <section className="page-card">
        <h2 className="card-title">
          <Edit3 /> Update Profile
        </h2>
        <p className="text-muted">Update your personal details below.</p>

        {message && (
          <Message
            type={message.toLowerCase().includes("success") ? "success" : "error"}
          >
            {message}
          </Message>
        )}

        <ProfileForm
          profile={profile}
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
          <h2 className="card-title">
            <Lock /> Change Password {showChangePw ? "▲" : "▼"}
          </h2>
          <p className="text-muted">
            Click to {showChangePw ? "hide" : "update"} your account password.
          </p>
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

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={pwLoading}
            >
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
