// src/pages/admin/AloDashboard.jsx

import { useState } from "react";
import { Megaphone, Users } from "lucide-react";

import RequirePermission from "../../components/RequirePermission";
import Tabs from "../../components/Tabs";
import Loader from "../../components/Loader";
import ErrorState from "../../components/ErrorState";
import useDepartmentId from "../../hooks/departments/useDepartmentId";
import TextDisplay from "../../components/TextDisplay";
import AddMember from "../../components/members/AddMember";
import MemberList from "../../components/members/MemberList";
import Announcements from "../../components/announcements/Announcements";

import styles from "../../styles/pages/SharedPages.module.css";

const tabs = [
  { key: "members", label: "Members", Icon: Users },
  { key: "announcements", label: "Announcements", Icon: Megaphone },
];

export default function AloDashboard() {
  const [activeTab, setActiveTab] = useState("members");

  const { departmentId, loading, isError, error, refetch } = useDepartmentId("women-ministries");

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
    <RequirePermission permission="access_alo_dashboard">
      <main className={`page-container ${styles.page}`}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <TextDisplay
              as="h1"
              size="2xl"
              weight="bold"
              color="primary"
            >
              Women's Ministries Department
            </TextDisplay>
            <TextDisplay as="p" size="md" color="muted">
              Oversee the church's women's ministries by managing members and publishing
              announcements for all ministry-related activities, meetings, and programs.
            </TextDisplay>
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
                title="Women Ministries Members"
                subtitle="Manage everyone serving in the women ministry"
              />
            </div>
          )}

          {activeTab === "announcements" && (
            <Announcements
              departmentId={departmentId}
              title="Women Ministries Announcements"
              subtitle="Share rehearsal schedules, ministry programs, and other updates with all ministry members"
            />
          )}
        </section>
      </main>
    </RequirePermission>
  );
}

