import { useEffect, useState } from "react";

import {
  RoleRequestsAPI,
  AdminMembershipAPI,
} from "../../utils/api";

import { useAuth } from "../../context/AuthContext";

import "../../styles/pages.css";

export default function AdminTabs({
  activeTab,
  setActiveTab,
}) {
  const {
    authReady,
    canUser,
  } = useAuth();

  const [rolePending, setRolePending] = useState(0);
  const [membershipPending, setMembershipPending] = useState(0);

  const canAccessAdmin =
    canUser("access_admin_dashboard");

  useEffect(() => {
    if (!authReady || !canAccessAdmin) return;

    const fetchCounts = async () => {
      try {
        const [roleData, membershipData] =
          await Promise.all([
            RoleRequestsAPI.pendingCount(),
            AdminMembershipAPI.fetchAll(),
          ]);

        setRolePending(roleData.count || 0);
        setMembershipPending(
          membershipData.length || 0
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchCounts();

    const interval = setInterval(
      fetchCounts,
      10000
    );

    return () => clearInterval(interval);
  }, [authReady, canAccessAdmin]);

  // auth still booting
  if (!authReady) return null;

  // no permission
  if (!canAccessAdmin) return null;

  return (
    <div className="admin-tabs">
      <button
        className={
          activeTab === "manage"
            ? "tab active"
            : "tab"
        }
        onClick={() =>
          setActiveTab("manage")
        }
      >
        Manage Members
      </button>

      <button
        className={
          activeTab === "non-members"
            ? "tab active"
            : "tab"
        }
        onClick={() =>
          setActiveTab("non-members")
        }
      >
        Non-Members
      </button>

      <button
        className={
          activeTab ===
          "membership-requests"
            ? "tab active"
            : "tab"
        }
        onClick={() =>
          setActiveTab(
            "membership-requests"
          )
        }
      >
        Membership Requests
        {membershipPending > 0 &&
          ` (${membershipPending})`}
      </button>

      <button
        className={
          activeTab === "role-requests"
            ? "tab active"
            : "tab"
        }
        onClick={() =>
          setActiveTab("role-requests")
        }
      >
        Role Requests
        {rolePending > 0 &&
          ` (${rolePending})`}
      </button>
    </div>
  );
}
