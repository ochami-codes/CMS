import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { formatDate } from "../../utils/formatDate";

export default function ChurchOverview() {
  const [counts, setCounts] = useState({
    youth: 0,
    children: 0,
    adults: 0,
    total: 0,
  });

  const [attendanceTrend, setAttendanceTrend] = useState([]); // [{date, count}]
  const [offerSummary, setOfferSummary] = useState(0);
  const [expenseSummary, setExpenseSummary] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOverview = async () => {
    setLoading(true);

    // 1) members summary
    const { data: membersData, error: membersError } = await supabase
      .from("members")
      .select("id,department");

    if (!membersError && membersData) {
      const youth = membersData.filter((m) => m.department === "youth").length;
      const children = membersData.filter((m) => m.department === "children")
        .length;
      const adults = membersData.filter((m) => m.department === "adults").length;
      const total = membersData.length;
      setCounts({ youth, children, adults, total });
    } else {
      console.error("Members fetch error:", membersError);
    }

    // 2) attendance trend (last 6 dates)
    // We expect attendance table rows like: { member_id, department, date (YYYY-MM-DD), present: boolean }
    const { data: attendanceData, error: attendanceError } = await supabase
      .from("attendance")
      .select("date,present")
      .order("date", { ascending: false })
      .limit(30); // fetch last 30 records, we will group by date

    if (!attendanceError && attendanceData) {
      // group by date and count present
      const map = {};
      attendanceData.forEach((rec) => {
        if (!rec || !rec.date) return;
        const d = rec.date; // assume already YYYY-MM-DD or string
        if (!map[d]) map[d] = 0;
        if (rec.present) map[d] += 1;
      });

      // create array sorted by date ascending, take last 6 unique dates
      const dates = Object.keys(map)
        .sort((a, b) => new Date(a) - new Date(b))
        .slice(-6);

      const trend = dates.map((d) => ({ date: d, count: map[d] }));
      setAttendanceTrend(trend);
    } else {
      console.error("Attendance fetch error:", attendanceError);
      setAttendanceTrend([]);
    }

    // 3) offerings & expenses
    const { data: offerings, error: offeringsError } = await supabase
      .from("offerings")
      .select("amount");
    if (!offeringsError && offerings) {
      const totalGivings = offerings.reduce((s, x) => s + Number(x.amount || 0), 0);
      setOfferSummary(totalGivings);
    } else {
      console.error("Offerings fetch error:", offeringsError);
      setOfferSummary(0);
    }

    const { data: expenses, error: expensesError } = await supabase
      .from("expenses")
      .select("amount");
    if (!expensesError && expenses) {
      const totalExpenses = expenses.reduce((s, x) => s + Number(x.amount || 0), 0);
      setExpenseSummary(totalExpenses);
    } else {
      console.error("Expenses fetch error:", expensesError);
      setExpenseSummary(0);
    }

    // 4) recent announcements/events
    const { data: ann, error: annError } = await supabase
      .from("announcements")
      .select("id,title,message,created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    if (!annError && ann) setEvents(ann);
    else {
      console.error("Announcements fetch error:", annError);
      setEvents([]);
    }

    setLoading(false);
  };

  // helper for bar widths
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

      {/* ATTENDANCE TREND - simple horizontal bars */}
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
                    <div
                      className="bar-fill"
                      style={{ width: `${pct}%` }}
                      title={`${t.count} present`}
                    />
                  </div>
                  <div className="bar-count">{t.count}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* OFFERINGS vs EXPENSES - side-by-side bars */}
      <div className="chart-section">
        <h2 className="section-title">Offerings vs Expenses</h2>

        <div className="money-bars">
          <div className="money-row">
            <div className="money-label">Offerings</div>
            <div className="money-track">
              <div
                className="money-fill"
                style={{
                  width: `${Math.round((offerSummary / maxMoney) * 100)}%`,
                }}
              />
            </div>
            <div className="money-value">KES {offerSummary.toLocaleString()}</div>
          </div>

          <div className="money-row">
            <div className="money-label">Expenses</div>
            <div className="money-track">
              <div
                className="money-fill expenses"
                style={{
                  width: `${Math.round((expenseSummary / maxMoney) * 100)}%`,
                }}
              />
            </div>
            <div className="money-value">KES {expenseSummary.toLocaleString()}</div>
          </div>

          <div className="money-row">
            <div className="money-label">Net</div>
            <div className="money-track">
              <div
                className="money-fill net"
                style={{
                  width: `${Math.round((Math.abs(offerSummary - expenseSummary) / maxMoney) * 100)}%`,
                }}
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

      {/* UPCOMING EVENTS */}
      <div style={{ marginTop: "2rem" }}>
        <h2 className="section-title">Recent Announcements / Events</h2>

        {events.length === 0 && <p>No updates yet.</p>}

        <ul className="event-list">
          {events.map((ev) => (
            <li key={ev.id} className="event-card">
              <h4 className="event-title">{ev.title}</h4>
              <p className="event-message">{ev.message}</p>
              <small className="event-date">{new Date(ev.created_at).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
