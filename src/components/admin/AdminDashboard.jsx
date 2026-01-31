import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminHeader";
import AdminTabs from "./AdminTabs";
import AdminContent from "./AdminContent";

export default function AdminDashboard() {
  const { profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("manage");

  if (loading) {
    return <div className="dashboard-content">Checking admin permissions…</div>;
  }

  if (!profile) {
    return <div className="dashboard-content">Loading admin profile…</div>;
  }

  return (
    <div className="dashboard-content">
      <AdminHeader />
      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <AdminContent activeTab={activeTab} />
    </div>
  );
}
