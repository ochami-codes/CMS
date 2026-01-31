import { useEffect, useState } from "react";
import { AdminAPI } from "../../utils/api";

export default function AdminTabs({ activeTab, setActiveTab }) {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
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
  }, []);

  return (
    <div className="stats-grid">
      <button
        className={`btn ${
          activeTab === "manage" ? "btn-primary" : "btn-secondary"
        }`}
        onClick={() => setActiveTab("manage")}
      >
        Manage Members
      </button>

      <button
        className={`btn ${
          activeTab === "requests" ? "btn-primary" : "btn-secondary"
        }`}
        onClick={() => setActiveTab("requests")}
      >
        Role Requests
        {pendingCount > 0 && (
          <span style={{ marginLeft: "6px", fontWeight: 700 }}>
            ({pendingCount})
          </span>
        )}
      </button>
    </div>
  );
}
