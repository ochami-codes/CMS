import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ProfileAPI } from "../../../utils/api";
import ProfileForm from "./ProfileForm";
import Contributions from "./Contributions";
import SummaryChart from "./SummaryChart";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { profile } = useAuth();
  const [localProfile, setLocalProfile] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!profile) return;

    const loadProfile = async () => {
      setLoading(true);
      setMessage("");
      try {
        const res = await ProfileAPI.get();
        setLocalProfile(res.profile || null);
        setContributions(res.contributions || []);
      } catch (err) {
        console.error(err);
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
      console.error(err);
      setMessage(err?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="dashboard-content">
      {/* ======================
          ROLE REQUEST CARD
      ====================== */}
      <div className="card">
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
          Role Requests
        </h2>

        <p style={{ color: "#6b7280", margin: "0.4rem 0 1rem" }}>
          Apply for leadership or ministry roles and track approval status.
        </p>

        <Link to="/myrolerequest" className="btn btn-primary">
          View / Submit Role Request
        </Link>
      </div>

      {/* ======================
          PROFILE CARD
      ====================== */}
      <div className="card">
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
          My Profile
        </h2>

        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
          Update your personal and church details below.
        </p>

        <ProfileForm
          profile={localProfile}
          onUpdate={handleUpdate}
          loading={loading}
          message={message}
        />
      </div>

      {/* ======================
          CONTRIBUTIONS
      ====================== */}
      {contributions && (
        <div className="stats-grid">
          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>
              Contributions
            </h3>

            <ul style={{ lineHeight: "1.9" }}>
              <li>Tithes: KES {contributions.tithes}</li>
              <li>Offerings: KES {contributions.offerings}</li>
              <li>Camp Offerings: KES {contributions.campOfferings}</li>
              <li>Church Development: KES {contributions.churchDevelopment}</li>
            </ul>
          </div>

          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>
              Contributions Breakdown
            </h3>

            <div style={{ height: "280px" }}>
              <SummaryChart contributions={contributions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
