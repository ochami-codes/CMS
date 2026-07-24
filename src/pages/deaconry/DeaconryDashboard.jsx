import { useState } from "react";
import {
  Megaphone,
  Users,
} from "lucide-react";

import RequirePermission from "../../components/RequirePermission";
import Tabs from "../../components/Tabs";
import Loader from "../../components/Loader";
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

export default function DeaconryDashboard() {
  const [activeTab, setActiveTab] =
    useState("members");

  const {
    departmentId,
    loading,
  } = useDepartmentId("deaconry");

  if (loading) {
      return (
        < Loader message="Loading Dashboard..."  fullScreen={true}/>
          );
    }

  return (
    <RequirePermission permission="manage_deaconry">
      <main className={`page-container ${styles.page}`}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>
              Deaconry Department
            </h1>

            <p className={styles.subtitle}>
              Oversee the church's deaconry ministry by
              managing deaconry department members and publishing
              announcements for all deaconry-related
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
                title="Deaconry Department Members"
                subtitle="Manage everyone serving in the deaconry."
              />
            </div>
          )}

          {activeTab === "announcements" && (
            <Announcements
              departmentId={departmentId}
              title="Deaconry Department Announcements"
              subtitle="Share rehearsal schedules, deaconry programs, and other updates with all deaconry members."
            />
          )}
        </section>
      </main>
    </RequirePermission>
  );
}
