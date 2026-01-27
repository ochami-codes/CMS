import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ProfileAPI } from "../../../utils/api";
import ProfileForm from "./ProfileForm";
import Contributions from "./Contributions";
import SummaryChart from "./SummaryChart";

export default function ProfilePage() {
  const { profile } = useAuth();

  const [localProfile, setLocalProfile] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!profile) return;

    const loadProfile = async () => {
      setLoading(true);
      setMessage("");

      try {
        const res = await ProfileAPI.get();
        setLocalProfile(res.profile);
        setContributions(res.contributions || []);
      } catch (err) {
        setMessage(err.message || "Failed to load profile");
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
      setMessage(err.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!localProfile) return null;

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-bold">My Profile</h2>
      <p className="text-gray-500 mb-4">
        Manage your personal and church information.
      </p>

      <ProfileForm
        profile={localProfile}
        onUpdate={handleUpdate}
        loading={loading}
        message={message}
      />

      {contributions.length > 0 && (
        <>
          <hr className="my-6" />
          <h3 className="font-semibold">Contributions</h3>
          <Contributions contributions={contributions} />
          <SummaryChart contributions={contributions} />
        </>
      )}
    </div>
  );
}
