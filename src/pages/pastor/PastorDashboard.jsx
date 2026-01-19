// src/pages/pastor/PastorDashboard.jsx
import { useEffect, useState } from "react";
import "../../styles/global.css";
import { OverviewAPI } from "../../utils/api";
import toast from "react-hot-toast";

export default function PastorDashboard() {
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      setLoading(true);
      try {
        const data = await OverviewAPI.fetchPastorOverview();
        setOverview(data ?? {});
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Failed to load dashboard");
        setOverview({});
      } finally {
        setLoading(false);
      }
    };

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
    <div className="dashboard-layout">
      <h1 className="page-title">Pastor Dashboard</h1>
      <p className="page-subtext">
        Overview of church departments and members.
      </p>

      <div className="stats-grid">
        {cards.map(card => (
          <div key={card.title} className="stat-card">
            <h3>{card.title}</h3>
            <p>Total members: {card.value}</p>
          </div>
        ))}

        <div className="stat-card">
          <h3>Reports</h3>
          <p>
            Generate overall church reports and attendance summaries.
          </p>
        </div>
      </div>
    </div>
  );
}
