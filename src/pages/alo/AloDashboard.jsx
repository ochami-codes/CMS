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

import styles from "../../styles/pages/SharedPages.module.css";

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

export default function AloDashboard() {
  const [activeTab, setActiveTab] =
    useState("members");

  const {
    departmentId,
    loading,
  } = useDepartmentId("women-ministries");

  if (loading) {
    return (
      <main className="page-container">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <RequirePermission permission="manage_women_ministries">
      <main className={`page-container ${styles.page}`}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>
              Women's Ministries Department
            </h1>

            <p className={styles.subtitle}>
              Oversee the church's women's ministries by
              managing women's ministries members and publishing
              announcements for all women's ministries-related
              activities, meetings, and programs.
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
