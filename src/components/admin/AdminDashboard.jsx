import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import AdminHeader from "./AdminHeader";
import AdminTabs from "./AdminTabs";
import AdminContent from "./AdminContent";

import Loader from "../Loader";
import Card from "../Card";

import styles from "../../styles/admin/AdminDashboard.module.css";

export default function AdminDashboard() {
  const {
    user,
    authReady,
    canUser,
  } = useAuth();

  const [activeTab, setActiveTab] =
    useState("manage");

  const [pageReady, setPageReady] =
    useState(false);

  useEffect(() => {
    if (!authReady) return;

    setPageReady(true);
  }, [authReady]);

  /* -----------------------
     LOADING AUTH
  ----------------------- */
  if (!authReady) {
    return (
      <div className={styles.center}>
        <Loader message="Loading dashboard..." />
      </div>
    );
  }

  /* -----------------------
     NOT LOGGED IN
  ----------------------- */
  if (!user) {
    return (
      <div className={styles.center}>
        <Card>
          Please sign in to continue.
        </Card>
      </div>
    );
  }

  /* -----------------------
     PERMISSION CHECK
  ----------------------- */
  if (!canUser("access_admin_dashboard")) {
    return (
      <div className={styles.center}>
        <Card>
          You do not have permission to access this page.
        </Card>
      </div>
    );
  }

  /* -----------------------
     LOCAL LOADING
  ----------------------- */
  if (!pageReady) {
    return (
      <div className={styles.center}>
        <Loader message="Preparing admin dashboard..." />
      </div>
    );
  }

  /* -----------------------
     MAIN UI
  ----------------------- */
  return (
    <div className={styles.page}>

      <AdminHeader />

      <AdminTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <Card className={styles.content}>
        <AdminContent activeTab={activeTab} />
      </Card>

    </div>
  );
}
