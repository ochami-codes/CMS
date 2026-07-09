import { useState } from "react";
import {
  Megaphone,
  Users,
} from "lucide-react";

import RequirePermission from "../../components/RequirePermission";
import Tabs from "../../components/Tabs";

import useDepartmentId from "../../hooks/departments/useDepartmentId";

import AddMember from "../../components/members/AddMember";
import MemberList from "../../components/members/MemberList";
import Announcements from "../../components/announcements/Announcements";

import styles from "../../styles/pages/ChoirDashboard.module.css";

const tabs = [
  {
    key: "members",
    label: "Members",
    Icon: Users,
  },
  {
    key: "announcements",
    label: "Announcements",
    Icon: Megaphone,
  },
];

export default function ChoirDashboard() {
  const [activeTab, setActiveTab] =
    useState("members");

  const {
    departmentId,
    loading,
  } = useDepartmentId("music");

  if (loading) {
    return (
      <main className="page-container">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <RequirePermission permission="manage_choir">
      <main className={`page-container ${styles.page}`}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>
              Music Department
            </h1>

            <p className={styles.subtitle}>
              Oversee the church's music ministry by
              managing music department members,
              including the choir, and publishing
              announcements for all music-related
              activities, rehearsals, and programs.
            </p>
          </div>
        </header>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <section className={styles.content}>
          {activeTab === "members" && (
            <div className={styles.members}>
              <AddMember
                departmentId={departmentId}
              />

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