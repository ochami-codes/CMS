// src/components/dashboard/ChurchOverview.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";
import { OverviewAPI } from "../../utils/api";
import "../../styles/global.css";

export default function ChurchOverview() {
  const [counts, setCounts] = useState({ youth: 0, children: 0, adults: 0, total: 0 });
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
      toast.error("Error loading overview: " + err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // ----------------- UTILITY CALCS -----------------
  const maxAttendance = Math.max(1, ...attendanceTrend.map((t) => t.count));
  const maxMoney = Math.max(1, offerSummary, expenseSummary);

  if (loading) return <p>Loading overview...</p>;

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Church Overview</h1>
      <p className="page-subtext">A full summary of the entire church.</p>

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

      {/* ATTENDANCE TREND */}
      <div className="chart-section">
        <h2 className="section-title">Attendance Trend (Recent)</h2>
        {attendanceTrend.length === 0 ? (
          <p>No attendance data yet.</p>
        ) : (
          <div className="bars-vertical">
            {attendanceTrend.map((t) => {
              const pct = Math.round((t.count / maxAttendance) * 100);
              return (
                <div className="bar-row" key={t.date}>
                  <div className="bar-label">{formatDate(t.date)}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%` }} title={`${t.count} present`} />
                  </div>
                  <div className="bar-count">{t.count}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* OFFERINGS VS EXPENSES */}
      <div className="chart-section">
        <h2 className="section-title">Offerings vs Expenses</h2>
        <div className="money-bars">
          <div className="money-row">
            <div className="money-label">Offerings</div>
            <div className="money-track">
              <div className="money-fill" style={{ width: `${Math.round((offerSummary / maxMoney) * 100)}%` }} />
            </div>
            <div className="money-value">KES {offerSummary.toLocaleString()}</div>
          </div>
          <div className="money-row">
            <div className="money-label">Expenses</div>
            <div className="money-track">
              <div className="money-fill expenses" style={{ width: `${Math.round((expenseSummary / maxMoney) * 100)}%` }} />
            </div>
            <div className="money-value">KES {expenseSummary.toLocaleString()}</div>
          </div>
          <div className="money-row">
            <div className="money-label">Net</div>
            <div className="money-track">
              <div
                className="money-fill net"
                style={{ width: `${Math.round((Math.abs(offerSummary - expenseSummary) / maxMoney) * 100)}%` }}
              />
            </div>
            <div
              className="money-value"
              style={{ color: offerSummary - expenseSummary >= 0 ? "green" : "red" }}
            >
              KES {(offerSummary - expenseSummary).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* RECENT EVENTS */}
      <div style={{ marginTop: "2rem" }}>
        <h2 className="section-title">Recent Announcements / Events</h2>
        {events.length === 0 ? (
          <p>No updates yet.</p>
        ) : (
          <ul className="event-list">
            {events.map((ev) => (
              <li key={ev.id} className="event-card">
                <h4 className="event-title">{ev.title}</h4>
                <p className="event-message">{ev.message}</p>
                <small className="event-date">{new Date(ev.created_at).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
