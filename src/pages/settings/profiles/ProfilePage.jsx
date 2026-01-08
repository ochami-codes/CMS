import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { API_BASE_URL } from "../../../config/api";
import ProfileForm from "./ProfileForm";
import Contributions from "./Contributions";
import SummaryChart from "./SummaryChart";

const ProfilePage = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/profile`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();
        setProfile(data.profile);
        setContributions(data.contributions);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleUpdate = async (updatedProfile) => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: updatedProfile.fullName,
          phone: updatedProfile.phone,
          email: updatedProfile.email, // 👈 backend handles auth update
        }),
      });

      if (!res.ok) {

        throw new Error("Profile update failed");

      setProfile(updatedProfile);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2>Your Profile</h2>
      <p style={{ color: "#666" }}>Manage your account information.</p>

      <ProfileForm
        profile={profile}
        onUpdate={handleUpdate}
        loading={loading}
        message={message}
      />

      <hr style={{ margin: "2rem 0" }} />

      <h3>Contributions</h3>
      <Contributions contributions={contributions} />

      <h3>Summary</h3>
      <SummaryChart contributions={contributions} />
    </div>
  );
};

export default ProfilePage;
