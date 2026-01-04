import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import "../../styles/global.css";

export default function PastorDashboard() {
  const [youthCount, setYouthCount] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/pastor/overview`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load dashboard data");

        const data = await res.json();
        setYouthCount(data.youth ?? 0);
        setChildrenCount(data.children ?? 0);
      } catch (err) {
        console.error(err.message);
        setYouthCount(0);
        setChildrenCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-layout">
      <h1 className="page-title">Pastor Dashboard</h1>
      <p className="page-subtext">
        Overview of church departments and members.
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Youth Department</h3>
          <p>Total members: {youthCount}</p>
        </div>

        <div className="stat-card">
          <h3>Children Department</h3>
          <p>Total members: {childrenCount}</p>
        </div>

        <div className="stat-card">
          <h3>Reports</h3>
          <p>Generate overall church reports and attendance summaries.</p>
        </div>
      </div>
    </div>
  );
}