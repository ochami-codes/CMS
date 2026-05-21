// components/admin/AdminTabs.jsx

import { useEffect, useState } from "react";
import {
  RoleRequestsAPI,
  AdminMembershipAPI,
} from "../../utils/api";

import { useAuth } from "../../context/AuthContext";

import styles from "../../styles/admin/AdminTabs.module.css";

export default function AdminTabs({
  activeTab,
  setActiveTab,
}) {
  const { authReady, canUser } =
    useAuth();

  const [counts, setCounts] =
    useState({
      roles: 0,
      memberships: 0,
    });

  const canAccess =
    canUser(
      "access_admin_dashboard"
    );

  useEffect(() => {
    if (
      !authReady ||
      !canAccess
    )
      return;

    const loadCounts =
      async () => {
        try {
          const [
            roleData,
            membershipData,
          ] =
            await Promise.all([
              RoleRequestsAPI.pendingCount(),
              AdminMembershipAPI.fetchAll(),
            ]);

          setCounts({
            roles:
              roleData?.count ||
              0,

            memberships:
              membershipData
                ?.length || 0,
          });
        } catch (err) {
          console.error(
            "Failed loading admin counts:",
            err
          );
        }
      };

    loadCounts();

    const interval =
      setInterval(
        loadCounts,
        10000
      );

    return () =>
      clearInterval(
        interval
      );
  }, [
    authReady,
    canAccess,
  ]);

  if (
    !authReady ||
    !canAccess
  )
    return null;

  const tabs = [
    {
      key: "manage",
      label:
        "Manage Members",
    },

    {
      key:
        "membership-requests",

      label:
        "Membership Requests",

      badge:
        counts.memberships,
    },

    {
      key:
        "role-requests",

      label:
        "Role Requests",

      badge:
        counts.roles,
    },
  ];

  return (
    <nav
      className={
        styles.tabs
      }
    >
      {tabs.map(
        (tab) => (
          <button
            key={
              tab.key
            }
            onClick={() =>
              setActiveTab(
                tab.key
              )
            }
            className={`
              ${styles.tab}
              ${
                activeTab ===
                tab.key
                  ? styles.active
                  : ""
              }
            `}
          >
            {tab.label}

            {!!tab.badge && (
              <span
                className={
                  styles.badge
                }
              >
                {
                  tab.badge
                }
              </span>
            )}
          </button>
        )
      )}
    </nav>
  );
}
