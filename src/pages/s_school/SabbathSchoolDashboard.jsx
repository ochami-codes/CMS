import { useState } from "react";
import { Users, BookOpen, ClipboardCheck, Wallet } from "lucide-react";

import RequirePermission from "../../components/RequirePermission";
import Tabs from "../../components/Tabs";
import Loader from "../../components/Loader";
import useDepartmentId from "../../hooks/departments/useDepartmentId";
import ErrorState from "../../components/ErrorState";
import MembersPage from "../../components/sabbathSchool/MembersPage";
import LessonGuidesPage from "../../components/sabbathSchool/LessonGuides";
import AttendancePage from "../../components/sabbathSchool/AttendancePage";
import FinancesPage from "../../components/sabbathSchool/FinancesPage";
import TextDisplay from "../../components/TextDisplay";

import styles from "../../styles/pages/SabbathSchool.module.css";

const tabs = [
  { key: "members", label: "Members", Icon: Users },
  { key: "guides", label: "Lesson Guides", Icon: BookOpen },
  { key: "attendance", label: "Attendance", Icon: ClipboardCheck },
  { key: "finances", label: "Finances", Icon: Wallet },
];

export default function SabbathSchoolDashboard() {
  const [activeTab, setActiveTab] = useState("members");

  const { departmentId, loading, isError } = useDepartmentId("sabbath-school");
  console.log("id:", departmentId);
  if (loading) {
    return <Loader message="Loading Dashboard..." fullScreen />;
  }

  if (isError) {
    return <ErrorState message="Failed to load department data." />;
  }

  return (
    <RequirePermission permission="access_s_school_dashboard">
      <main className={`page-container ${styles.page}`}>
        <header className={styles.header}>
          <div>
            <TextDisplay as="h1" size="bg" >Sabbath School Department</TextDisplay>
            <TextDisplay as="p" size="sm" color="muted">
              Manage Sabbath School members, lesson guide orders, attendance, and departmental finances.
            </TextDisplay>
          </div>
        </header>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <section className={styles.content}>
          {activeTab === "members" && <MembersPage departmentId={departmentId} />}
          {activeTab === "guides" && <LessonGuidesPage departmentId={departmentId} />}
          {activeTab === "attendance" && <AttendancePage departmentId={departmentId} />}
          {activeTab === "finances" && <FinancesPage departmentId={departmentId} />}
        </section>
      </main>
    </RequirePermission>
  );
}

