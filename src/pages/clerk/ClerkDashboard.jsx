import { useEffect, useState } from "react";
import "../../styles/pages.css";

export default function ClerkDashboard() {
  const [members, setMembers] = useState([]);
  const [children, setChildren] = useState([]);
  const [transfers, setTransfers] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH DATA (replace with Supabase)
  // =========================
  useEffect(() => {
    async function fetchData() {
      try {
        // Replace with real API calls
        setMembers([
          {
            id: 1,
            name: "John Doe",
            phone: "0712345678",
            department: "Elders",
            gender: "Male",
          },
        ]);

        setChildren([
          {
            id: 1,
            name: "Baby Jane",
            parent_phone: "0712345678",
            gender: "Female",
          },
        ]);

        setTransfers([
          {
            id: 1,
            name: "Mary Smith",
            to_church: "Nairobi Central",
            status: "pending",
          },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // =========================
  // REMOVE MEMBER
  // =========================
  const handleRemove = (id) => {
    const reason = prompt(
      "Enter reason: Death, Transfer, Heresy or Other"
    );

    if (!reason) return;

    // Call backend here
    alert(`Member removed. Reason: ${reason}`);

    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // =========================
  // DOWNLOAD REPORT
  // =========================
  const handleDownload = (type) => {
    alert(`Downloading ${type} report...`);
    // Replace with backend PDF/CSV generation
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="page-container">

      {/* =========================
          MEMBERS SECTION
      ========================= */}
      <div className="page-card">
        <h2 className="card-title">📋 Church Register</h2>

        <div className="table-responsive">
          <table className="members-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Gender</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.phone}</td>
                  <td>{m.department}</td>
                  <td>{m.gender}</td>
                  <td>
                    <button
                      className="btn btn-danger action-btn"
                      onClick={() => handleRemove(m.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          CHILDREN SECTION
      ========================= */}
      <div className="page-card">
        <h2 className="card-title">👶 Children Register</h2>

        <div className="table-responsive">
          <table className="members-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Parent Phone</th>
                <th>Gender</th>
              </tr>
            </thead>

            <tbody>
              {children.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.parent_phone}</td>
                  <td>{c.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          TRANSFER REQUESTS
      ========================= */}
      <div className="page-card">
        <h2 className="card-title">🔁 Transfer Requests</h2>

        <div className="table-responsive">
          <table className="members-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>To Church</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {transfers.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.to_church}</td>
                  <td>
                    <span className={`status-label status-${t.status}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          REPORTS & SUMMARY
      ========================= */}
      <div className="page-card">
        <h2 className="card-title">📊 Membership Summary</h2>

        <p className="card-subtitle">
          Quarterly and yearly overview (charts coming soon)
        </p>

        {/* Placeholder for charts */}
        <div className="dashboard-info-card">
          Charts will be displayed here (Recharts / Chart.js)
        </div>

        <div className="dashboard-actions">
          <button
            className="btn btn-primary"
            onClick={() => handleDownload("quarterly")}
          >
            Download Quarterly Report
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => handleDownload("yearly")}
          >
            Download Yearly Report
          </button>
        </div>
      </div>

    </div>
  );
}
