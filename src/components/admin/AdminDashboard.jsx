import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import AdminHeader from "./AdminHeader";
import AdminTabs from "./AdminTabs";
import AdminContent from "./AdminContent";

import Loader from "../../components/Loader";

import "../../styles/pages.css";

export default function AdminDashboard() {
  const {
    user,
    authReady,
    canUser,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("manage");
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    if (!authReady) return;

    // local dashboard bootstrap
    setPageReady(true);
  }, [authReady]);

  // auth still initializing
  if (!authReady) {
    return (
      <div className="dashboard-content">
        <Loader message="Loading dashboard..." />
      </div>
    );
  }

  // not authenticated
  if (!user) {
    return (
      <div className="dashboard-content">
        <div className="card">
          Please sign in to continue.
        </div>
      </div>
    );
  }

  // permission gate
  if (!canUser("access_admin_dashboard")) {
    return (
      <div className="dashboard-content">
        <div className="card">
          You do not have permission to access this page.
        </div>
      </div>
    );
  }

  // local page loading
  if (!pageReady) {
    return (
      <div className="dashboard-content">
        <Loader message="Preparing admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* HEADER */}
      <AdminHeader />

      {/* TABS */}
      <AdminTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* CONTENT */}
      <div className="card">
        <AdminContent activeTab={activeTab} />
      </div>
    </div>
  );
}
