// src/pages/departments/ChildrenDashboard.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ChildrenList from "../../components/children/ChildrenList";
import { ChildrenAPI } from "../../utils/api";
import "../../styles/pages.css";
import RequirePermission from "../../components/RequirePermission";

export default function ChildrenDashboard() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshToggle, setRefreshToggle] = useState(false);

  // Fetch children from API
  const loadChildren = async () => {
    setLoading(true);
    try {
      const data = await ChildrenAPI.fetchAll();
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

  const refreshChildren = () => setRefreshToggle((prev) => !prev);

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
