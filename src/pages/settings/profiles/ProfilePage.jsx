// src/pages/settings/profiles/ProfilePage.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../../components/ToastProvider";
import { ProfileAPI, AuthAPI } from "../../../utils/api";
import ProfileForm from "./ProfileForm";
import SummaryChart from "./SummaryChart";
import { User, Mail, Phone, Edit3, Lock } from "lucide-react";
import styles from
"../../../styles/pages/Profile.module.css";

import Card from "../../../components/Card";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import StatCard from "../../../components/StatCard";
  /* =========================
useProfile Hook
========================= */
const useProfile = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [contributions, setContributions] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showChangePw, setShowChangePw] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
const { user } = useAuth();
const isGuest = user?.role_name === "guest";
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
const res = await ProfileAPI.get();
setProfile(res?.profile || null);
setContributions(
res?.contributions ? normalizeContributions(res.contributions) : null
);
} catch (err) {
showToast(err?.message || "Failed to load profile", "error");
} finally {
setLoading(false);
}
};

const updateProfile = async (updates) => {
try {
setLoading(true);
await ProfileAPI.update(updates);
setProfile((prev) => ({ ...prev, ...updates }));
showToast("Profile updated successfully", "success");
} catch (err) {
showToast(err?.message || "Profile update failed", "error");
} finally {
setLoading(false);
}
};

const changePassword = async (e) => {
e.preventDefault();
setPwError("");

if (!newPassword || !confirmPassword) {  
  showToast("Both fields are required", "error");
return;
}  
if (newPassword !== confirmPassword) {  
  showToast("Passwords do not match", "error");
return;  
}  
if (newPassword.length < 6) {  
  showToast("Password must be at least 6 characters", "error");
return;  
}  

try {  
  setPwLoading(true);  
  await AuthAPI.changePassword({ newPassword });  
  navigate("/profile/change-password-success", { state: { fromProfile: true } });  
} catch (err) {  
  showToast(err?.message || "Failed to update password", "error");  
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
};
};

/* =========================
Profile Page
========================= */
export default function ProfilePage() {
const { user } = useAuth();
const isGuest = user?.role_name === "guest";
const canRequestRole = user.is_member===true && user.role_name !=="admin";
const navigate = useNavigate();
const {
profile,
contributions,
loading,
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
<main className={styles.page}>
{/* MY ACCOUNT */}  
<Card title="My Account">

<div className={styles.profileGrid}>

{profileFields.map(
({ label,value,Icon }) => (

<div
key={label}
className={styles.profileItem}
>

<Icon className={styles.icon} />

<div>
<p className={styles.label}>
{label}
</p>

<p className={styles.value}>
{value}
</p>

</div>

</div>

))}

</div>

</Card>

  {/* UPDATE PROFILE */}  
 <Card title="Update Profile">

<ProfileForm
profile={profile}
onUpdate={updateProfile}
loading={loading}
/>

</Card>  

  {/* CHANGE PASSWORD */}  
 <Card>

<div className={styles.passwordSection}>

<Button
variant="secondary"
onClick={() =>
setShowChangePw(v => !v)
}
className={styles.toggleBtn}
>

<Lock />

Change Password

{showChangePw ? "▲" : "▼"}

</Button>

{showChangePw && (

<form
onSubmit={changePassword}
className={styles.passwordForm}
>

<Input
type="password"
label="New Password"
value={newPassword}
onChange={(e)=>
setNewPassword(
e.target.value
)
}
/>

<Input
type="password"
label="Confirm Password"
value={confirmPassword}
onChange={(e)=>
setConfirmPassword(
e.target.value
)
}
/>

<Button
type="submit"
loading={pwLoading}
fullWidth
>

Update Password

</Button>

</form>

)}

</div>

</Card>  

  {/* CONTRIBUTIONS */}  
 {contributions &&
Object.values(contributions)
.some(v => v > 0) && (

<div className={styles.statsGrid}>

<StatCard title="Contributions">

<ul className={styles.statsList}>

<li>
Tithes
<span>
KES {contributions.tithes}
</span>
</li>

<li>
Offerings
<span>
KES {contributions.offerings}
</span>
</li>

<li>
Camp
<span>
KES {contributions.campOfferings}
</span>
</li>

<li>
Development
<span>
KES {contributions.churchDevelopment}
</span>
</li>

</ul>

</StatCard>


<Card title="Breakdown">

<div className={styles.chart}>
<SummaryChart
contributions={contributions}
/>
</div>

</Card>

</div>

)}  
</main>

);
}
