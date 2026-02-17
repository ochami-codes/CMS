// src/pages/settings/profiles/ProfilePage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProfileAPI, AuthAPI } from "../../../utils/api";
import ProfileForm from "./ProfileForm";
import SummaryChart from "./SummaryChart";
import { User, Mail, Phone, Edit3, Lock } from "lucide-react";

/* =========================
   Message Component
========================= */
const Message = ({ type = "success", children }) => {
  console.log("🟦 Message render:", { type, children });
  return (
    <div className={`card ${type === "success" ? "message-success" : "message-error"}`}>
      <p>{children}</p>
    </div>
  );
};

/* =========================
   useProfile Hook (DEBUG)
========================= */
const useProfile = () => {
  console.log("🟢 useProfile hook INIT");

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

  /* -------------------------
     Normalize Contributions
  ------------------------- */
  const normalizeContributions = (list = []) => {
    console.log("🔄 normalizeContributions input:", list);

    const totals = {
      tithes: 0,
      offerings: 0,
      campOfferings: 0,
      churchDevelopment: 0,
    };

    list.forEach(({ fund_name, total_amount }) => {
      console.log("➡️ fund row:", fund_name, total_amount);

      switch (fund_name) {
        case "Tithes":
          totals.tithes += total_amount;
          break;
        case "Offerings":
          totals.offerings += total_amount;
          break;
        case "Camp Offerings":
          totals.campOfferings += total_amount;
          break;
        case "Church Development":
          totals.churchDevelopment += total_amount;
          break;
        default:
          console.warn("⚠️ Unknown fund:", fund_name);
      }
    });

    console.log("✅ normalizeContributions output:", totals);
    return totals;
  };

  /* -------------------------
     Load Profile
  ------------------------- */
  const loadProfile = async () => {
    console.log("📡 loadProfile START");

    try {
      setLoading(true);
      setMessage("");

      console.log("📡 Calling ProfileAPI.get()");
      const res = await ProfileAPI.get();

      console.log("📡 ProfileAPI.get() response:", res);

      setProfile(res?.profile || null);

      if (res?.contributions) {
        const normalized = normalizeContributions(res.contributions);
        setContributions(normalized);
      } else {
        console.warn("⚠️ No contributions in response");
        setContributions(null);
      }
    } catch (err) {
      console.error("🔥 loadProfile ERROR:", err);
      setMessage(err?.message || "Failed to load profile");
    } finally {
      console.log("📡 loadProfile END");
      setLoading(false);
    }
  };

  /* -------------------------
     Update Profile
  ------------------------- */
  const updateProfile = async (updates) => {
    console.log("✏️ updateProfile called with:", updates);

    try {
      setLoading(true);
      setMessage("");

      await ProfileAPI.update(updates);
      console.log("✅ ProfileAPI.update success");

      setProfile((prev) => {
        console.log("🔁 profile before update:", prev);
        return { ...prev, ...updates };
      });

      setMessage("Profile updated successfully");
    } catch (err) {
      console.error("🔥 updateProfile ERROR:", err);
      setMessage(err?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     Change Password
  ------------------------- */
  const changePassword = async (e) => {
    e.preventDefault();
    console.log("🔐 changePassword submit");

    setPwError("");

    if (!newPassword || !confirmPassword) {
      console.warn("⚠️ Password fields empty");
      return setPwError("Both fields are required");
    }

    if (newPassword !== confirmPassword) {
      console.warn("⚠️ Password mismatch");
      return setPwError("Passwords do not match");
    }

    if (newPassword.length < 6) {
      console.warn("⚠️ Password too short");
      return setPwError("Password must be at least 6 characters");
    }

    try {
      setPwLoading(true);
      console.log("🔐 Calling AuthAPI.changePassword");

      await AuthAPI.changePassword({ newPassword });

      console.log("✅ Password changed, navigating");
      navigate("/profile/change-password-success", {
        state: { fromProfile: true },
      });
    } catch (err) {
      console.error("🔥 changePassword ERROR:", err);
      setPwError(err?.message || "Failed to update password");
    } finally {
      setPwLoading(false);
    }
  };

  /* -------------------------
     Initial Load
  ------------------------- */
  useEffect(() => {
    console.log("⚙️ useProfile useEffect RUN");
    loadProfile();
  }, []);

  console.log("🟢 useProfile RETURN");

  return {
    profile,
    contributions,
    loading,
    message,
    showChangePw,
    setShowChangePw,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    pwLoading,
    pwError,
    updateProfile,
    changePassword,
    setMessage,
  };
};

/* =========================
   Profile Page (DEBUG)
========================= */
export default function ProfilePage() {
  console.log("🧱 ProfilePage render START");

  const {
    profile,
    contributions,
    loading,
    message,
    showChangePw,
    setShowChangePw,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    pwLoading,
    pwError,
    updateProfile,
    changePassword,
  } = useProfile();

  console.log("🧱 ProfilePage state:", {
    loading,
    profile,
    contributions,
    message,
  });

  /* -------------------------
     Guards
  ------------------------- */
  if (loading || !profile) {
    console.warn("⏳ Rendering loading / missing profile", { loading, profile });

    return (
      <main className="page-container">
        <section className="page-card">
          {loading ? "Loading profile…" : "Profile not found."}
        </section>
      </main>
    );
  }

  const profileFields = [
    { label: "Full Name", value: profile.full_name, Icon: User },
    { label: "Email Address", value: profile.email, Icon: Mail },
    { label: "Phone Number", value: profile.phone || "Not provided", Icon: Phone },
  ];

  console.log("🧱 Rendering FULL profile page");

  const hasContributions =
    contributions &&
    typeof contributions === "object" &&
    Object.values(contributions).some((v) => Number(v) > 0);

  console.log("📊 hasContributions:", hasContributions, contributions);

  return (
    <main className="page-container">
      {console.log("🖼️ JSX START")}

      {/* ROLE REQUEST */}
      <section className="page-card">
        <h2 className="card-title">Role Requests</h2>
        <Link to="/myrolerequest" className="btn btn-primary">
          View / Submit Role Request
        </Link>
      </section>

      {/* MY ACCOUNT */}
      <section className="page-card">
        <h2 className="card-title">
          <User /> My Account
        </h2>

        <div className="profile-info">
          {profileFields.map(({ label, value, Icon }) => {
            console.log("👤 profile field:", label, value);
            return (
              <div className="profile-item" key={label}>
                <Icon className="icon" />
                <div>
                  <p className="label">{label}</p>
                  <p className="value">{value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* UPDATE PROFILE */}
      <section className="page-card">
        <h2 className="card-title">
          <Edit3 /> Update Profile
        </h2>

        {message && (
          <Message
            type={message.toLowerCase().includes("success") ? "success" : "error"}
          >
            {message}
          </Message>
        )}

        <ProfileForm
          profile={profile}
          onUpdate={updateProfile}
          loading={loading}
        />
      </section>

      {/* CHANGE PASSWORD */}
      <section className="page-card">
        <button
          type="button"
          onClick={() => {
            console.log("🔁 Toggle change password");
            setShowChangePw((v) => !v);
          }}
          className="btn-toggle"
        >
          <Lock /> Change Password {showChangePw ? "▲" : "▼"}
        </button>

        {showChangePw && (
          <form onSubmit={changePassword} className="form-stack">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                console.log("🔐 newPassword change");
                setNewPassword(e.target.value);
              }}
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                console.log("🔐 confirmPassword change");
                setConfirmPassword(e.target.value);
              }}
            />

            {pwError && <Message type="error">{pwError}</Message>}

            <button disabled={pwLoading}>
              {pwLoading ? "Updating…" : "Update Password"}
            </button>
          </form>
        )}
      </section>

      {/* CONTRIBUTIONS */}
      {hasContributions && (
        <section className="stats-grid">
          <div className="page-card">
            <ul>
              <li>Tithes: {contributions.tithes}</li>
              <li>Offerings: {contributions.offerings}</li>
              <li>Camp Offerings: {contributions.campOfferings}</li>
              <li>Church Development: {contributions.churchDevelopment}</li>
            </ul>
          </div>

          <div className="page-card">
            {console.log("📈 Rendering SummaryChart")}
            <SummaryChart contributions={contributions} />
          </div>
        </section>
      )}

      {console.log("🖼️ JSX END")}
    </main>
  );
}
