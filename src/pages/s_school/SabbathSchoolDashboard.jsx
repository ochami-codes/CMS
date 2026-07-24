import { useState } from "react";
import {
  Users,
  BookOpen,
  ClipboardCheck,
  Wallet,
} from "lucide-react";

import RequirePermission from "../../components/RequirePermission";
import Tabs from "../../components/Tabs";
import Loader from "../../components/Loader";
import useDepartmentId from "../../hooks/departments/useDepartmentId";

import MembersPage from "../../components/sabbathSchool/MembersPage";
import LessonGuidesPage from "../../components/sabbathSchool/LessonGuides";
import AttendancePage from "../../components/sabbathSchool/AttendancePage";
import FinancesPage from "../../components/sabbathSchool/FinancesPage";

import styles from "../../styles/pages/SabbathSchool.module.css";

const tabs = [
  {
    key: "members",
    label: "Members",
    Icon: Users,
  },
  {
    key: "guides",
    label: "Lesson Guides",
    Icon: BookOpen,
  },
  {
    key: "attendance",
    label: "Attendance",
    Icon: ClipboardCheck,
  },
  {
    key: "finances",
    label: "Finances",
    Icon: Wallet,
  },
];

export default function SabbathSchoolDashboard() {
  const [activeTab, setActiveTab] =
    useState("members");

  const {
    departmentId,
    loading,
  } = useDepartmentId(
    "sabbath-school"
  );

 if (loading) {
     return (
       < Loader message="Loading Dashboard..."  fullScreen={true}/>
         );
   }

  return (
    <RequirePermission permission="manage_sabbath_school">
      <main
        className={`page-container ${styles.page}`}
      >
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>
              Sabbath School Department
            </h1>

            <p className={styles.subtitle}>
              Manage Sabbath School members,
              lesson guide orders, attendance,
              and departmental finances.
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
            <MembersPage
              departmentId={departmentId}
            />
          )}

          {activeTab === "guides" && (
            <LessonGuidesPage
              departmentId={departmentId}
            />
          )}

          {activeTab === "attendance" && (
            <AttendancePage
              departmentId={departmentId}
            />
          )}

          {activeTab === "finances" && (
            <FinancesPage
              departmentId={departmentId}
            />
          )}
        </section>
      </main>
    </RequirePermission>
  );
}
