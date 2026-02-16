import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminHeader";
import AdminTabs from "./AdminTabs";
import AdminContent from "./AdminContent";
import "../../styles/pages.css";

export default function AdminDashboard() {
  const { user, loading } = useAuth(); // <- updated from profile to user
  const [activeTab, setActiveTab] = useState("manage");

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="card">Checking admin permissions…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-content">
        <div className="card">Loading admin profile…</div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="card">
        <AdminHeader />
      </div>

      <div className="card">
        <AdminTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <div className="card">
        <AdminContent activeTab={activeTab} />
      </div>
    </div>
  );
}
