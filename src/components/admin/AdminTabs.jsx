import { useEffect, useState } from "react";
import { RoleRequestsAPI } from "../../utils/api";
import { AdminMembershipAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function AdminTabs({ activeTab, setActiveTab }) {
  const { profile } = useAuth();
  const [rolePending, setRolePending] = useState(0);
  const [membershipPending, setMembershipPending] = useState(0);

  /* ------------------ Fetch Pending Counts ------------------ */
  useEffect(() => {
    if (!profile?.role_name || profile.role_name !== "Admin") return;

    const fetchCounts = async () => {
      try {
        const roleData = await RoleRequestsAPI.pendingCount();
        const membershipData = await AdminMembershipAPI.fetchAll();
        setRolePending(roleData.count || 0);
        setMembershipPending(membershipData.length || 0);
      } catch (err) {
        console.error("Failed to fetch pending counts:", err);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, [profile]);

  if (!profile?.role_name || profile.role_name !== "Admin") return null;

  return (
    <div className="stats-grid flex flex-wrap gap-2">
      <button
        className={`btn ${activeTab === "manage" ? "btn-primary" : "btn-secondary"}`}
        onClick={() => setActiveTab("manage")}
      >
        Manage Members
      </button>

      <button
        className={`btn ${activeTab === "non-members" ? "btn-primary" : "btn-secondary"}`}
        onClick={() => setActiveTab("non-members")}
      >
        Non-Members
      </button>

      <button
        className={`btn ${activeTab === "membership-requests" ? "btn-primary" : "btn-secondary"}`}
        onClick={() => setActiveTab("membership-requests")}
      >
        Membership Requests {membershipPending > 0 && <span>({membershipPending})</span>}
      </button>

      <button
        className={`btn ${activeTab === "role-requests" ? "btn-primary" : "btn-secondary"}`}
        onClick={() => setActiveTab("role-requests")}
      >
        Role Requests {rolePending > 0 && <span>({rolePending})</span>}
      </button>
    </div>
  );
}
