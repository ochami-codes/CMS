import { useState, useEffect } from "react";

export default function SabbathSchoolDashboard() {
  // =========================
  // STATE
  // =========================
  const [attendance, setAttendance] = useState({
    men: "",
    women: "",
    youth: "",
    children: "",
    guests: "",
  });

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    async function fetchData() {
      try {
        // Replace with Supabase later
        setSubscriptions([
          {
            id: 1,
            name: "John Doe",
            phone: "0712345678",
          },
          {
            id: 2,
            name: "Mary Jane",
            phone: "0798765432",
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
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setAttendance({
      ...attendance,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SUBMIT ATTENDANCE
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Attendance:", attendance);

    alert("Attendance saved successfully");

    // Reset
    setAttendance({
      men: "",
      women: "",
      youth: "",
      children: "",
      guests: "",
    });
  };

  // =========================
  // DOWNLOAD REPORT
  // =========================
  const handleDownload = (type) => {
    alert(`Downloading ${type} report...`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="page-container">

      {/* =========================
          ATTENDANCE INPUT
      ========================= */}
      <div className="page-card">
        <h2 className="card-title">📊 Sabbath School Attendance</h2>

        <form onSubmit={handleSubmit} className="form-stack">

          <div className="form-group">
            <label>Men</label>
            <input
              type="number"
              name="men"
              value={attendance.men}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label>Women</label>
            <input
              type="number"
              name="women"
              value={attendance.women}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label>Youth</label>
            <input
              type="number"
              name="youth"
              value={attendance.youth}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label>Children</label>
            <input
              type="number"
              name="children"
              value={attendance.children}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label>Guests</label>
            <input
              type="number"
              name="guests"
              value={attendance.guests}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Save Attendance
          </button>
        </form>
      </div>

      {/* =========================
          LESSON SUBSCRIPTIONS
      ========================= */}
      <div className="page-card">
        <h2 className="card-title">📖 Lesson Subscriptions</h2>

        <div className="table-responsive">
          <table className="members-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
              </tr>
            </thead>

            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td>{sub.name}</td>
                  <td>{sub.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          SUMMARY CHARTS
      ========================= */}
      <div className="page-card">
        <h2 className="card-title">📈 Attendance Summary</h2>

        <p className="card-subtitle">
          Monthly, Quarterly, Yearly insights
        </p>

        {/* Placeholder */}
        <div className="dashboard-info-card">
          Charts will appear here (Recharts / Chart.js)
        </div>
      </div>

      {/* =========================
          DOWNLOAD REPORTS
      ========================= */}
      <div className="page-card">
        <h2 className="card-title">⬇️ Reports</h2>

        <div className="dashboard-actions">
          <button
            className="btn btn-primary"
            onClick={() => handleDownload("monthly")}
          >
            Download Monthly
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => handleDownload("quarterly")}
          >
            Download Quarterly
          </button>

          <button
            className="btn btn-success"
            onClick={() => handleDownload("yearly")}
          >
            Download Yearly
          </button>
        </div>
      </div>

    </div>
  );
}
