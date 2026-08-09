import { useState } from "react";
import { Megaphone, Users } from "lucide-react";

import RequirePermission from "../../components/RequirePermission";
import Tabs from "../../components/Tabs";
import Loader from "../../components/Loader";
import useDepartmentId from "../../hooks/departments/useDepartmentId";
import ErrorState from "../../components/ErrorState";
import AddMember from "../../components/members/AddMember";
import MemberList from "../../components/members/MemberList";
import Announcements from "../../components/announcements/Announcements";
import TextDisplay from "../../components/TextDisplay";
import styles from "../../styles/pages/SharedPages.module.css";

const tabs = [
  { key: "members", label: "Members", Icon: Users },
  { key: "announcements", label: "Announcements", Icon: Megaphone },
];

export default function YouthDashboard() {
  const [activeTab, setActiveTab] = useState("members");

  const { departmentId, loading, isError } = useDepartmentId("youth");

  if (loading) {
    return <Loader message="Loading Dashboard..." fullScreen />;
  }

  if (isError) {
    return <ErrorState message="Failed to load department data." />;
  }

  return (
    <RequirePermission permission="access_youth_dashboard">
      <main className={`page-container ${styles.page}`}>
        <header className={styles.header}>
          <div>
            <TextDisplay
              as="h1"
              size="2xl"
              weight="bold"
              color="primary"
            >
              Youth Department
            </TextDisplay>
            <TextDisplay as="p" size="md" color="muted">
              Oversee the church's youth ministry by managing youth department members and publishing
              announcements for all youth-related activities, meetings, and programs.
            </TextDisplay>
          </div>
        </header>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <section className={styles.content}>
          {activeTab === "members" && (
            <div className={styles.members}>
              <AddMember departmentId={departmentId} />
              <MemberList
                departmentId={departmentId}
                title="Youth Department Members"
                subtitle="Manage everyone serving in the youth ministry, including choir members."
              />
            </div>
          )}

          {activeTab === "announcements" && (
            <Announcements
              departmentId={departmentId}
              title="Youth Department Announcements"
              subtitle="Share rehearsal schedules, youth programs, and other updates with all members of the youth department."
            />
          )}
        </section>
      </main>
    </RequirePermission>
  );
}

