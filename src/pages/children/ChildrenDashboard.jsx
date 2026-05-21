// src/pages/departments/ChildrenDashboard.jsx
import { useEffect, useState } from "react";
import { useToast } from "../../components/ToastProvider";
import ChildrenList from "../../components/children/ChildrenList";
import { ChildrenAPI } from "../../utils/api";

import RequirePermission from "../../components/RequirePermission";

export default function ChildrenDashboard() {
  const { showToast } = useToast();

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const loadChildren = async () => {
    setLoading(true);

    try {
      const data = await ChildrenAPI.fetchAll();
      setChildren(data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load children", "error");
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, [refreshToggle]);

  const refreshChildren = () => {
    setRefreshToggle((prev) => !prev);
    showToast("Children list refreshed", "success");
  };

  return (
    <RequirePermission permission="manage_children">
      <div className="dashboard-content">

        {/* ======================
           PAGE HEADER
        ====================== */}
        <div className="card">
          <h2 className="card-title">Children Department</h2>
          <p className="card-subtitle">
            Manage children records, parents’ contacts, and attendance.
          </p>
        </div>

        {/* ======================
           CHILDREN LIST
        ====================== */}
        <div className="card">
          <ChildrenList
            children={children}
            loading={loading}
            onRefresh={refreshChildren}
          />
        </div>

      </div>
    </RequirePermission>
  );
}
