// src/pages/settings/profiles/ProfilePage.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ProfileAPI, AuthAPI } from "../../../utils/api";
import ProfileForm from "./ProfileForm";
import SummaryChart from "./SummaryChart";
import { User, Mail, Phone, Edit3, Lock } from "lucide-react";

/* =========================
Message Component
========================= */
const Message = ({ type = "success", children }) => (

  <div className={`card ${type === "success" ? "message-success" : "message-error"}`}>  
    <p>{children}</p>  
  </div>  
);  /* =========================
useProfile Hook
========================= */
const useProfile = () => {
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
const { user } = useAuth();
const isGuest = user?.role_name === "Guest";
const normalizeContributions = (list = []) => {
const totals = {
tithes: 0,
offerings: 0,
campOfferings: 0,
churchDevelopment: 0,
};
list.forEach(({ fund_name, total_amount }) => {
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
}
});
return totals;
};

const loadProfile = async () => {
try {
setLoading(true);
setMessage("");
const res = await ProfileAPI.get();
setProfile(res?.profile || null);
setContributions(
res?.contributions ? normalizeContributions(res.contributions) : null
);
} catch (err) {
setMessage(err?.message || "Failed to load profile");
} finally {
setLoading(false);
}
};

const updateProfile = async (updates) => {
try {
setLoading(true);
setMessage("");
await ProfileAPI.update(updates);
setProfile((prev) => ({ ...prev, ...updates }));
setMessage("Profile updated successfully");
} catch (err) {
setMessage(err?.message || "Profile update failed");
} finally {
setLoading(false);
}
};

const changePassword = async (e) => {
e.preventDefault();
setPwError("");

if (!newPassword || !confirmPassword) {  
  return setPwError("Both fields are required");  
}  
if (newPassword !== confirmPassword) {  
  return setPwError("Passwords do not match");  
}  
if (newPassword.length < 6) {  
  return setPwError("Password must be at least 6 characters");  
}  

try {  
  setPwLoading(true);  
  await AuthAPI.changePassword({ newPassword });  
  navigate("/profile/change-password-success", { state: { fromProfile: true } });  
} catch (err) {  
  setPwError(err?.message || "Failed to update password");  
} finally {  
  setPwLoading(false);  
}

};

useEffect(() => {
loadProfile();
}, []);

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
loadProfile,
updateProfile,
changePassword,
setMessage,
};
};

/* =========================
Profile Page
========================= */
export default function ProfilePage() {
const { user } = useAuth();
const isGuest = user?.role_name === "Guest";
const navigate = useNavigate();
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
setMessage,
} = useProfile();

if (loading || !profile) {
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

return (
<main className="page-container">
{/* ROLE REQUEST (Hidden for Guests) */}
{!isGuest && (
  <section className="page-card">
    <h2 className="card-title">Role Requests</h2>

    <p className="text-muted">
      Click the button below to view or request for a role.
    </p>

    <Link
      to="/myrolerequest"
      className="btn btn-primary"
      style={{
        marginTop: "0.75rem",
        width: "fit-content",
        padding: "0.75rem 1.75rem",
        fontSize: "0.95rem",
      }}
    >
      View / Request Role
    </Link>
  </section>
)}
{/* MY ACCOUNT */}  
  <section className="page-card">
    <h2 className="card-title">  
      <User /> My Account  
    </h2>  
    <p className="text-muted">Your basic account information.</p>  

    <div className="profile-info">  
      {profileFields.map(({ label, value, Icon }) => (  
        <div className="profile-item" key={label}>  
          <Icon className="icon" />  
          <div>  
            <p className="label">{label}</p>  
            <p className="value">{value}</p>  
          </div>  
        </div>  
      ))}  
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

    <ProfileForm profile={profile} onUpdate={updateProfile} loading={loading} />  
  </section>  

  {/* CHANGE PASSWORD */}  
  <section className="page-card">  
    <button  
      type="button"  
      onClick={() => setShowChangePw((v) => !v)}  
      aria-expanded={showChangePw}  
      className="btn-toggle"  
    >  
      <Lock /> Change Password {showChangePw ? "▲" : "▼"}  
    </button>  

    {showChangePw && (  
      <form onSubmit={changePassword} className="form-stack">  
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
  {contributions && Object.values(contributions).some((v) => v > 0) && (  
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
