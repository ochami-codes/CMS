// src/pages/pastor/PastorDashboard.jsx
import { useEffect, useState } from "react";
import "../../styles/pages.css";
import { OverviewAPI } from "../../utils/api";
import toast from "react-hot-toast";

export default function PastorDashboard() {
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(true);

  // Load overview using OverviewAPI
  const loadOverview = async () => {
    setLoading(true);
    try {
      const data = await OverviewAPI.fetchPastorOverview();
      setOverview(data ?? {});
    } catch (err) {
      console.error("Pastor dashboard load error:", err);
      toast.error(err.message || "Failed to load dashboard");
      setOverview({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  if (loading) return <p>Loading dashboard…</p>;

  const cards = [
    {
      title: "Youth Department",
      value: overview.youth ?? 0,
    },
    {
      title: "Children Department",
      value: overview.children ?? 0,
    },
  ];

  return (
    <div className="dashboard-content">

      {/* ======================
         PAGE HEADER
      ====================== */}
      <div className="card">
        <h2 className="card-title">Pastor Dashboard</h2>
        <p className="card-subtitle">
          Overview of church departments and members.
        </p>
      </div>

      {/* ======================
         STATS GRID
      ====================== */}
      <div className="stats-grid">
        {cards.map((card) => (
          <div key={card.title} className="stat-card card">
            <h3>{card.title}</h3>
            <p>Total members: {card.value}</p>
          </div>
        ))}

        <div className="stat-card card">
          <h3>Reports</h3>
          <p>Generate overall church reports and attendance summaries.</p>
        </div>
      </div>
    </div>
  );
}
