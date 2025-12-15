import "../styles/global.css";

export default function Dashboard() {
  return (
      <div className="dashboard-layout">

        <h1 className="page-title">Dashboard</h1>

        <p className="page-subtext">
          Welcome back! Choose a department from the sidebar to continue.
        </p>

        {/* Quick stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Youth Department</h3>
            <p>View members and activities</p>
          </div>

          <div className="stat-card">
            <h3>Children Department</h3>
            <p>Manage programs</p>
          </div>

          <div className="stat-card">
            <h3>Communications</h3>
            <p>Check announcements and updates</p>
          </div>
        </div>

      </div>
  );
}
