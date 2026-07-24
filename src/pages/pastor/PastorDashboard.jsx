import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Landmark,
  Users,
} from "lucide-react";

import RequirePermission from "../../components/RequirePermission";
import Tabs from "../../components/Tabs";
import Loader from "../../components/Loader";
import usePastorDashboard from "../../hooks/pastor/usePastorDashboard";
import ErrorState from "../../components/ErrorState";
import PastorOverview from "./PastorOverview";
import PastorDepartments from "./PastorDepartments";
import PastorTreasury from "./PastorTreasury";
import PastorMembers from "./PastorMembers";

import styles from "../../styles/pages/PastorDashboard.module.css";

const tabs = [
  {
    key: "overview",
    label: "Overview",
    Icon: LayoutDashboard,
  },
  {
    key: "departments",
    label: "Departments",
    Icon: Building2,
  },
  {
    key: "treasury",
    label: "Treasury",
    Icon: Landmark,
  },
  {
    key: "members",
    label: "Members",
    Icon: Users,
  },
];

export default function PastorDashboard() {
  const [activeTab, setActiveTab] =
    useState("overview");

  const {
    data,
    loading,
    error,
    refresh,
    isFetching,
  } = usePastorDashboard();

  if (loading) {
    return <Loader message="Loading dashboard..."
    fullScreen={false} />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load dashboard."
        onRetry={refresh}
      />
    );
  }

  return (
    <RequirePermission permission="view_dashboard">
      <main
        className={`page-container ${styles.page}`}
      >
        <header className={styles.header}>
          <h1 className={styles.title}>
            Pastor Dashboard
          </h1>

          <p className={styles.subtitle}>
            View church departments, treasury,
            and membership insights.
          </p>
        </header>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <section className={styles.content}>
          {activeTab === "overview" && (
            <PastorOverview
              overview={data.overview}
              isFetching={isFetching}
            />
          )}

          {activeTab === "departments" && (
            <PastorDepartments
              departments={data.departments}
            />
          )}

          {activeTab === "treasury" && (
            <PastorTreasury
              treasury={data.treasury}
            />
          )}

          {activeTab === "members" && (
            <PastorMembers
              summary={data.members.summary}
              members={data.members.list}
            />
          )}
        </section>
      </main>
    </RequirePermission>
  );
}
