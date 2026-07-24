import { useState } from "react";
import {
  Users,
  ClipboardCheck,
} from "lucide-react";

import RequirePermission from "../../components/RequirePermission";
import Tabs from "../../components/Tabs";
import Loader from "../../components/Loader";
import Card from "../../components/Card";
import ChildrenList from "../../components/children/ChildrenList";
import ChildrenAttendance from "../../components/children/ChildrenAttendance";
import useDepartmentId from "../../hooks/departments/useDepartmentId";
import useChildren from "../../hooks/clerk/useChildren";

import styles from "../../styles/pages/ChildrenDashboard.module.css";

const tabs = [
  {
    key: "register",
    label: "Children Register",
    Icon: Users,
  },
  {
    key: "attendance",
    label: "Attendance",
    Icon: ClipboardCheck,
  },
];

export default function ChildrenDashboard() {
  const [activeTab, setActiveTab] =
    useState("register");

  const {
    children,
    loading,
    error,
    refresh,
  } = useChildren();

   const {
      departmentId,
      loading: deptLoading
    } = useDepartmentId("children");
    if (deptLoading) {
        return (
          < Loader message="Loading Dashboard..."  fullScreen={true}/>
            );
      }

  return (
    <RequirePermission permission="manage_children">
      <main
        className={`page-container ${styles.page}`}
      >
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>
              Children Department
            </h1>

            <p className={styles.subtitle}>
              View registered children and
              record Sabbath attendance for
              your department.
            </p>
          </div>
        </header>

        <Card className={styles.notice}>
          <h3 className={styles.noticeTitle}>
            Clerk Managed Register
          </h3>

          <p className={styles.noticeText}>
            Only children registered by the
            Church Clerk appear in this list.
            If a child's name is missing,
            kindly request the Clerk to add
            them before recording attendance.
          </p>
        </Card>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <section className={styles.content}>
          {activeTab === "register" && (
            <ChildrenList
              children={children}
              loading={loading}
              error={error}
              onRefresh={refresh}
            />
          )}

          {activeTab ===
            "attendance" && (
            <ChildrenAttendance
              departmentId={departmentId}
              children={children}
              loading={loading}
            />
          )}
        </section>
      </main>
    </RequirePermission>
  );
}