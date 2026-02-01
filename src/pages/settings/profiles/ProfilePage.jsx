import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ProfileAPI } from "../../../utils/api";
import ProfileForm from "./ProfileForm";
import Contributions from "./Contributions";
import SummaryChart from "./SummaryChart";
import { Link } from "react-router-dom"; // <-- for the link

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

  if (loading) return <div className="dashboard-content"><p>Loading profile…</p></div>;
  if (!localProfile) return <div className="dashboard-content"><p className="text-red-500">Profile not found.</p></div>;

  return (
    <div className="dashboard-content space-y-6">
      {/* Profile Card */}
      <div className="card">
        <h2 className="text-xl font-bold mb-2">My Profile</h2>
        <p className="text-gray-500 mb-4">Manage your personal and church information.</p>
        <ProfileForm
          profile={localProfile}
          onUpdate={handleUpdate}
          loading={loading}
          message={message}
        />
        <div className="mt-4">
          <Link to="/myrolerequest" className="text-blue-600 underline font-medium">
            Submit/View Role Requests
          </Link>
        </div>
      </div>

      {/* Contributions */}
{contributions.length > 0 && (
  <div className="grid gap-6 md:grid-cols-2 mt-6">
    {/* Contributions List */}
    <div className="card">
      <h3 className="font-semibold mb-3">Contributions</h3>
      <ul className="space-y-1">
        <li>Tithes: KES {contributions.tithes}</li>
        <li>Offerings: KES {contributions.offerings}</li>
        <li>Camp Offerings: KES {contributions.campOfferings}</li>
        <li>Church Development: KES {contributions.churchDevelopment}</li>
      </ul>
    </div>

    {/* Summary Chart */}
    <div className="card">
      <h3 className="font-semibold mb-3">Contributions Breakdown</h3>
      <div className="w-full h-72">
        <SummaryChart contributions={contributions} />
      </div>
    </div>
  </div>
)}
 </div>
  );
}
