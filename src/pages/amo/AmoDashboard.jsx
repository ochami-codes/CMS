// src/pages/admin/AmoDashboard.jsx

import { useState } from "react";
import { Megaphone, Users } from "lucide-react";

import RequirePermission from "../../components/RequirePermission";
import Tabs from "../../components/Tabs";
import Loader from "../../components/Loader";
import ErrorState from "../../components/ErrorState";
import useDepartmentId from "../../hooks/departments/useDepartmentId";

import AddMember from "../../components/members/AddMember";
import MemberList from "../../components/members/MemberList";
import Announcements from "../../components/announcements/Announcements";

import styles from "../../styles/pages/SharedPages.module.css";

const tabs = [
  { key: "members", label: "Members", Icon: Users },
  { key: "announcements", label: "Announcements", Icon: Megaphone },
];

export default function AmoDashboard() {
  const [activeTab, setActiveTab] = useState("members");

  const { departmentId, loading, isError, error, refetch } = useDepartmentId("amo");

  /* -------------------------
     LOADING STATE
  -------------------------- */
  if (loading) {
    return <Loader message="Loading Dashboard..." fullScreen />;
  }

  /* -------------------------
     ERROR STATE
  -------------------------- */
  if (isError) {
    return (
      <ErrorState
        title="Failed to load department"
        message={error?.message ?? "Something went wrong while fetching department data."}
        onRetry={refetch}
      />
    );
  }

  /* -------------------------
     MAIN VIEW
  -------------------------- */
  return (
    <RequirePermission permission="manage_amo">
      <main className={`page-container ${styles.page}`}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>AMO Department</h1>
            <p className={styles.subtitle}>
              Oversee the church's AMO ministry by managing members and publishing announcements
              for all AMO-related activities, meetings, and programs.
            </p>
          </div>
        </header>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Content */}
        <section className={styles.content}>
          {activeTab === "members" && (
            <div className={styles.members}>
              <AddMember departmentId={departmentId} />
              <MemberList
                departmentId={departmentId}
                title="AMO Department Members"
                subtitle="Manage everyone serving in the AMO ministry."
              />
            </div>
          )}

          {activeTab === "announcements" && (
            <Announcements
              departmentId={departmentId}
              title="AMO Department Announcements"
              subtitle="Share rehearsal schedules, AMO programs, and other updates with all ministry members."
            />
          )}
        </section>
      </main>
    </RequirePermission>
  );
}
