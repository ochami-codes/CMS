// src/pages/departments/ChildrenDashboard.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ChildrenList from "../../components/children/ChildrenList";
import { ChildrenAPI } from "../../utils/api"; // central API
import "../../styles/global.css";

export default function ChildrenDashboard() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshToggle, setRefreshToggle] = useState(false); // trigger refresh

  // Fetch children from API
  const loadChildren = async () => {
    setLoading(true);
    try {
      const data = await ChildrenAPI.fetch();
      setChildren(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load children: " + err.message);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, [refreshToggle]);

  // Trigger a refresh after add/edit/delete
  const refreshChildren = () => setRefreshToggle((prev) => !prev);

  return (
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
  );
}
