import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ProfileAPI, AuthAPI } from "../../../utils/api";
import ProfileForm from "./ProfileForm";
import SummaryChart from "./SummaryChart";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { profile } = useAuth();

  const [localProfile, setLocalProfile] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // -------------------- Change password state --------------------
  const [showChangePw, setShowChangePw] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  // -------------------- Load profile --------------------
  useEffect(() => {
    if (!profile) return;

    const load = async () => {
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

    load();
  }, [profile]);

  // -------------------- Profile update --------------------
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

  // -------------------- Password change --------------------
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

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
      const res = await AuthAPI.changePassword({ newPassword });
      setPwSuccess(res.message || "Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwError(err?.message || "Failed to update password");
    } finally {
      setPwLoading(false);
    }
  };

  // -------------------- Styled Message --------------------
  const Message = ({ type = "success", children }) => {
    const styles =
      type === "success"
        ? {
            bg: "bg-green-50",
            border: "border-green-400",
            text: "text-green-800",
            icon: "M5 13l4 4L19 7",
          }
        : {
            bg: "bg-red-50",
            border: "border-red-400",
            text: "text-red-800",
            icon: "M6 18L18 6M6 6l12 12",
          };

    return (
      <div
        className={`my-3 p-3 rounded-md border-l-4 ${styles.bg} ${styles.border} flex items-center gap-2`}
      >
        <svg
          className={`w-4 h-4 ${styles.text} flex-shrink-0`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={styles.icon} />
        </svg>

        <span className={`text-sm font-medium ${styles.text}`}>
          {children}
        </span>
      </div>
    );
  };

  // -------------------- Loading / missing --------------------
  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="card">Loading profile…</div>
      </div>
    );
  }

  if (!localProfile) {
    return (
      <div className="dashboard-content">
        <div className="card">Profile not found.</div>
      </div>
    );
  }

  // -------------------- Render --------------------
  return (
    <div className="dashboard-content">
      {/* ROLE REQUEST */}
      <div className="card">
        <h2 className="text-lg font-semibold">Role Requests</h2>
        <p className="text-gray-500 mb-3">
          Apply for leadership or ministry roles and track approval status.
        </p>
        <Link to="/myrolerequest" className="btn btn-primary">
          View / Submit Role Request
        </Link>
      </div>

      {/* PROFILE */}
      <div className="card">
        <h2 className="text-lg font-semibold">My Profile</h2>
        <p className="text-gray-500 mb-3">
          Update your personal and church details below.
        </p>

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
      </div>

      {/* CHANGE PASSWORD */}
      <div className="card">
        <div
          className="cursor-pointer"
          onClick={() => setShowChangePw((v) => !v)}
        >
          <h2 className="text-lg font-semibold">
            Change Password {showChangePw ? "▲" : "▼"}
          </h2>
          <p className="text-gray-500 mb-3">
            Click to {showChangePw ? "hide" : "update"} your account password.
          </p>
        </div>

        {showChangePw && (
          <form onSubmit={handleChangePassword} className="space-y-3">
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
            />

            {pwError && <Message type="error">{pwError}</Message>}
            {pwSuccess && <Message type="success">{pwSuccess}</Message>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={pwLoading}
            >
              {pwLoading ? "Updating…" : "Update Password"}
            </button>
          </form>
        )}
      </div>

      {/* CONTRIBUTIONS */}
      {contributions && (
        <div className="stats-grid">
          <div className="card">
            <h3 className="font-semibold mb-2">Contributions</h3>
            <ul className="leading-relaxed">
              <li>Tithes: KES {contributions.tithes}</li>
              <li>Offerings: KES {contributions.offerings}</li>
              <li>Camp Offerings: KES {contributions.campOfferings}</li>
              <li>Church Development: KES {contributions.churchDevelopment}</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-2">Contributions Breakdown</h3>
            <div style={{ height: "280px" }}>
              <SummaryChart contributions={contributions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
