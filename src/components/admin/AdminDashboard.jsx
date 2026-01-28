import { useState, useEffect } from "react";
import ManageRoles from "./ManageRoles";
import RoleRequests from "./RoleRequests";
import { AdminAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("manage");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!profile) return;

    const fetchPendingCount = async () => {
      try {
        const data = await AdminAPI.pendingRoleRequestsCount();
        setPendingCount(data.count || 0);
      } catch (err) {
        console.error("Failed to fetch pending count:", err);
      }
    };

    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 10000);
    return () => clearInterval(interval);
  }, [profile]);

  if (loading) {
    return <div className="p-4">Checking admin permissions…</div>;
  }

  if (!profile) {
    return <div className="p-4">Loading admin profile…</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="flex gap-2 mb-4 border-b">
        <button
          onClick={() => setActiveTab("manage")}
          className={`px-4 py-2 rounded-t ${
            activeTab === "manage"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Manage Members
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 rounded-t relative ${
            activeTab === "requests"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Role Requests
          {pendingCount > 0 && (
            <span className="ml-2 inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      <div className="border rounded p-2">
        {activeTab === "manage" && <ManageRoles />}
        {activeTab === "requests" && <RoleRequests />}
      </div>
    </div>
  );
}
