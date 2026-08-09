import { useState } from "react";

import { useAuth } from "../../context/AuthContext";

import AdminHeader from "./AdminHeader";
import AdminContent from "./AdminContent";

import Tabs from "../Tabs";
import Loader from "../Loader";
import Card from "../Card";

import styles from "../../styles/admin/AdminDashboard.module.css";

const TABS = (counts) => [
  {
    key: "manage",
    label: "Manage Members",
  },
  {
    key: "membership-requests",
    label: "Membership Requests",
    badge: counts.memberships,
  },
  {
    key: "role-requests",
    label: "Role Requests",
    badge: counts.roles,
  },
  {
    key: "manage-departments",
    label: "Manage Departments",
  }
];

function CenterMessage({ children }) {
  return (
    <div className={styles.center}>
      <Card>{children}</Card>
    </div>
  );
}

export default function AdminDashboard({
  counts = {
    memberships: 0,
    roles: 0,
  },
}) {
  const {
    user,
    authReady,
    canUser,
  } = useAuth();

  const [activeTab, setActiveTab] =
    useState("manage");

  /* -----------------------
     AUTH LOADING
  ----------------------- */

  if (!authReady) {
    return (
      <div className={styles.center}>
        <Loader message="Loading dashboard..." />
      </div>
    );
  }

  /* -----------------------
     NOT SIGNED IN
  ----------------------- */

  if (!user) {
    return (
      <CenterMessage>
        Please sign in to continue.
      </CenterMessage>
    );
  }

  /* -----------------------
     ACCESS CHECK
  ----------------------- */

  if (
    !canUser(
      "access_admin_dashboard"
    )
  ) {
    return (
      <CenterMessage>
        You do not have permission
        to access this page.
      </CenterMessage>
    );
  }

  /* -----------------------
     UI
  ----------------------- */

  return (
    <div className={styles.page}>
      <AdminHeader />

      <Tabs
        tabs={TABS(counts)}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <Card className={styles.content}>
        <AdminContent
          activeTab={activeTab}
        />
      </Card>
    </div>
  );
}