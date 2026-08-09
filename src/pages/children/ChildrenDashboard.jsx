// src/pages/admin/ChildrenDashboard.jsx

import { useState } from "react";
import { Users, ClipboardCheck } from "lucide-react";

import RequirePermission from "../../components/RequirePermission";
import Tabs from "../../components/Tabs";
import Loader from "../../components/Loader";
import Card from "../../components/Card";
import ChildrenList from "../../components/children/ChildrenList";
import ChildrenAttendance from "../../components/children/ChildrenAttendance";
import ErrorState from "../../components/ErrorState";
import TextDisplay from "../../components/TextDisplay";
import useDepartmentId from "../../hooks/departments/useDepartmentId";
import useChildren from "../../hooks/clerk/useChildren";

import styles from "../../styles/pages/ChildrenDashboard.module.css";

const tabs = [
  { key: "register", label: "Children Register", Icon: Users },
  { key: "attendance", label: "Attendance", Icon: ClipboardCheck },
];

export default function ChildrenDashboard() {
  const [activeTab, setActiveTab] = useState("register");

  const { children, loading, isError: childrenError, error, refresh } = useChildren();
  const { departmentId, loading: deptLoading, isError: deptError, error: deptErrorDetails, refetch } =
    useDepartmentId("children");

  /* -------------------------
     LOADING STATE
  -------------------------- */
  if (deptLoading) {
    return <Loader message="Loading Dashboard..." fullScreen />;
  }

  /* -------------------------
     ERROR STATE
  -------------------------- */
  if (deptError) {
    return (
      <ErrorState
        title="Failed to load department"
        message={deptErrorDetails?.message ?? "Something went wrong while fetching department data."}
        onRetry={refetch}
      />
    );
  }

  /* -------------------------
     MAIN VIEW
  -------------------------- */
  return (
    <RequirePermission permission="access_children_dashboard">
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
              Children Department
            </TextDisplay>
            <TextDisplay as="p" size="md" color="muted">
              View registered children and record Sabbath attendance for your department.
            </TextDisplay>
          </div>
        </header>

        {/* Notice */}
        <Card className={styles.notice}>
          <TextDisplay as="p" size="sm" color="success">
            Only children registered by the Church Clerk appear in this list. If a child's name is
            missing, kindly request the Clerk to add them before recording attendance.
          </TextDisplay>
        </Card>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Content */}
        <section className={styles.content}>
          {activeTab === "register" && (
            <ChildrenList
              children={children}
              loading={loading}
              error={error}
              isError={childrenError}
              onRefresh={refresh}
            />
          )}

          {activeTab === "attendance" && (
            <ChildrenAttendance departmentId={departmentId} children={children} loading={loading} />
          )}
        </section>
      </main>
    </RequirePermission>
  );
}

