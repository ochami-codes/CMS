// src/pages/pastor/ChurchOverview.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";
import { OverviewAPI } from "../../utils/api";
import RequirePermission from "../../components/RequirePermission";
import "../../styles/global.css";

export default function ChurchOverview() {
  const [counts, setCounts] = useState({
    youth: 0,
    children: 0,
    adults: 0,
    total: 0,
  });
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [offerSummary, setOfferSummary] = useState(0);
  const [expenseSummary, setExpenseSummary] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    setLoading(true);
    const toastId = toast.loading("Loading church overview...");

    try {
      const data = await OverviewAPI.fetch();
      if (!data) throw new Error("No overview data available");

      setCounts(data.counts || {});
      setAttendanceTrend(data.attendanceTrend || []);
      setOfferSummary(data.offerSummary || 0);
      setExpenseSummary(data.expenseSummary || 0);
      setEvents(data.events || []);

      toast.dismiss(toastId);
    } catch (err) {
      console.error(err);
      toast.error("Error loading overview", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading overview...</p>;

  return (
    <RequirePermission permission="view_finances">
      <div className="dashboard-page">
        <h1 className="page-title">Church Overview</h1>
        <p className="page-subtext">
          A full summary of the entire church.
        </p>

        {/* MEMBERS SUMMARY */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Members</h3>
            <p className="stat-value">{counts.total}</p>
          </div>
          <div className="stat-card">
            <h3>Youth Members</h3>
            <p className="stat-value">{counts.youth}</p>
          </div>
          <div className="stat-card">
            <h3>Children Members</h3>
            <p className="stat-value">{counts.children}</p>
          </div>
          <div className="stat-card">
            <h3>Adult Members</h3>
            <p className="stat-value">{counts.adults}</p>
          </div>
        </div>

        {/* rest of your component unchanged */}
      </div>
    </RequirePermission>
  );
}
