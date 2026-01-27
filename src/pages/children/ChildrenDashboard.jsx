// src/pages/departments/ChildrenDashboard.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ChildrenList from "../../components/children/ChildrenList";
import { ChildrenAPI } from "../../utils/api";
import RequirePermission from "../../components/RequirePermission";
import "../../styles/global.css";

export default function ChildrenDashboard() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshToggle, setRefreshToggle] = useState(false);

  // Fetch children from API
  const loadChildren = async () => {
    setLoading(true);
    try {
      const data = await ChildrenAPI.fetchAll(); // ✅ fixed
      setChildren(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load children");
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, [refreshToggle]);

  const refreshChildren = () =>
    setRefreshToggle((prev) => !prev);

  return (
    <RequirePermission permission="manage_children">
      <div className="dashboard-layout">
        {/* Page header */}
        <h1 className="page-title">Children Department</h1>
        <p className="page-subtext">
          Manage children records, parents’ contacts, and attendance.
        </p>

        {/* Children CRUD */}
        <ChildrenList
          children={children}
          loading={loading}
          onRefresh={refreshChildren}
        />
      </div>
    </RequirePermission>
  );
}
