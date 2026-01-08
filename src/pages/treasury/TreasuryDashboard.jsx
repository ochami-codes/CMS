// src/pages/treasury/TreasuryDashboard.jsx
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend
} from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../styles/global.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#d0ed57"];

export default function TreasuryDashboard() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("quarter");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/treasury/summary?period=${filter}`,
          { credentials: "include" }
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Treasury summary error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [filter]);

  if (loading || !data) return <p>Loading treasury data…</p>;

  /* ------------------ CHART DATA ------------------ */

  const pieData = [
    ...data.conference.map(i => ({
      name: `${i.account} (Conference)`,
      value: i.amount
    })),
    ...data.church.map(i => ({
      name: `${i.account} (Church)`,
      value: i.amount
    }))
  ];

  const departmentBarData = data.departments;

  /* ------------------ PDF ------------------ */

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.text(`Treasury Report – ${data.period}`, 14, 20);

    const rows = [
      ...data.conference.map(i => [i.account, i.amount, "Sent to Conference"]),
      ...data.church.map(i => [i.account, i.amount, "Kept by Church"]),
      ...data.departments.map(d => [`Dept: ${d.name}`, d.amount, "Department"])
    ];

    doc.autoTable({
      startY: 30,
      head: [["Account", "Amount", "Status"]],
      body: rows
    });

    doc.save(`treasury-${filter}-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  /* ------------------ UI ------------------ */

  return (
    <div className="dashboard-layout">
      <h1 className="page-title">Treasury Department</h1>
      <p className="page-subtext">
        Ledger-based financial summary for the selected period.
      </p>

      <div style={{ marginBottom: 16 }}>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="quarter">Quarterly</option>
          <option value="year">Yearly</option>
        </select>

        <button style={{ marginLeft: 16 }} onClick={downloadReport}>
          Download PDF
        </button>
      </div>

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <h3>Church vs Conference</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1, minWidth: 320 }}>
          <h3>Departmental Contributions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentBarData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="stats-grid" style={{ marginTop: 32 }}>
        <div className="stat-card">
          <h3>Total Expenses</h3>
          <p>{data.expenses}</p>
        </div>
        <div className="stat-card">
          <h3>Church Budget</h3>
          <p>{data.budget}</p>
        </div>
      </div>
    </div>
  );
}