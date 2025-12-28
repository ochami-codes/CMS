import { useState, useEffect } from "react";
import ManageRoles from "./ManageRoles";
import RoleRequests from "./RoleRequests";
import { supabase } from "../../supabaseClient";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("manage");
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch pending role requests count every 10 seconds
  const fetchPendingCount = async () => {
    const { count, error } = await supabase
      .from("role_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    if (!error) setPendingCount(count);
  };

  useEffect(() => {
    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Tabs */}
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

      {/* Tab Content */}
      <div className="border rounded p-2">
        {activeTab === "manage" && <ManageRoles />}
        {activeTab === "requests" && <RoleRequests />}
      </div>
    </div>
  );
}