// src/pages/treasury/EnvelopeEntry.jsx
import { useState } from "react";
import { API_BASE_URL } from "../../config/api";
import toast from "react-hot-toast";
import "../../styles/global.css";

const MAIN_ACCOUNTS = [
  { key: "tithe", label: "Tithe" },
  { key: "combined", label: "Combined Offering" },
  { key: "camp", label: "Camp Offering" },
  { key: "development", label: "Church Development" },
  { key: "loose", label: "Loose Offering" }
];

const DEPARTMENTS = [
  "Choir",
  "Youth / Ambassadors",
  "Sabbath School",
  "Children",
  "AMO",
  "Women Ministries",
  "Deaconry"
];

export default function EnvelopeEntry() {
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  const [main, setMain] = useState({});
  const [departments, setDepartments] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const updateMain = (key, value) =>
    setMain({ ...main, [key]: Number(value) || 0 });

  const updateDepartment = (dept, value) =>
    setDepartments({ ...departments, [dept]: Number(value) || 0 });

  const total =
    Object.values(main).reduce((a, b) => a + b, 0) +
    Object.values(departments).reduce((a, b) => a + b, 0);

  const submitEnvelope = async () => {
    if (total <= 0) {
      toast.error("Envelope total must be greater than zero");
      return;
    }

    const entries = [
      ...Object.entries(main)
        .filter(([_, amt]) => amt > 0)
        .map(([key, amount]) => ({
          account: key.toUpperCase(),
          amount
        })),

      ...Object.entries(departments)
        .filter(([_, amt]) => amt > 0)
        .map(([department, amount]) => ({
          account: "DEPARTMENT",
          department,
          amount
        }))
    ];

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/treasury/envelope`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ date, entries })
      });

      if (!res.ok) throw new Error("Failed to save envelope");

      toast.success("Envelope recorded successfully");
      setMain({});
      setDepartments({});
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <h1 className="page-title">Envelope Entry</h1>
      <p className="page-subtext">
        Record tithe and offerings exactly as on the envelope.
      </p>

      <div className="card">
        <label>
          Date
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
      </div>

      <div className="card">
        <h3>Main Accounts</h3>
        {MAIN_ACCOUNTS.map(acc => (
          <label key={acc.key}>
            {acc.label}
            <input
              type="number"
              min="0"
              value={main[acc.key] || ""}
              onChange={e => updateMain(acc.key, e.target.value)}
            />
          </label>
        ))}
      </div>

      <div className="card">
        <h3>Departmental Giving</h3>
        {DEPARTMENTS.map(dept => (
          <label key={dept}>
            {dept}
            <input
              type="number"
              min="0"
              value={departments[dept] || ""}
              onChange={e => updateDepartment(dept, e.target.value)}
            />
          </label>
        ))}
      </div>

      <div className="card">
        <h2>Total: {total}</h2>
        <button onClick={submitEnvelope} disabled={submitting}>
          {submitting ? "Saving..." : "Submit Envelope"}
        </button>
      </div>
    </div>
  );
}