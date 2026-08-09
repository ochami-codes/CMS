// src/pages/admin/ChoirDashboard.jsx

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

export default function ChoirDashboard() {
  const [activeTab, setActiveTab] = useState("members");

  const { departmentId, loading, isError, error, refetch } = useDepartmentId("music");

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
    <RequirePermission permission="access_choir_dashboard">
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
              Music Department
            </TextDisplay>
            <TextDisplay as="p" size="md" color="muted">
              Oversee the church's choir ministry by managing choir department members and publishing
              announcements for all music-related activities, rehearsals, and programs.
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
                title="Music Department Members"
                subtitle="Manage everyone serving in the music ministry, including choir members."
              />
            </div>
          )}

          {activeTab === "announcements" && (
            <Announcements
              departmentId={departmentId}
              title="Music Department Announcements"
              subtitle="Share rehearsal schedules, music programs, and other updates with all members of the music department."
            />
          )}
        </section>
      </main>
    </RequirePermission>
  );
}
