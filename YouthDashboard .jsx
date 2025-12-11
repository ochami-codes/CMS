import MemberList from "../../components/members/MemberList";
import Attendance from "../../components/members/Attendance";

export default function YouthDashboard() {
  return (
    <div className="dashboard-page">
      <h1 className="page-title">Youth Department</h1>
      <p className="page-subtext">
        Manage youth members, activities, attendance, and events.
      </p>

      {/* Quick stats / cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Youth Members</h3>
          <p>View and manage all youths in the church.</p>
        </div>

        <div className="stat-card">
          <h3>Programs & Activities</h3>
          <p>Plan events, rallies, Bible study sessions.</p>
        </div>

        <div className="stat-card">
          <h3>Reports</h3>
          <p>Generate attendance and activity reports.</p>
        </div>
      </div>

      {/* Member list CRUD */}
      <div style={{ marginTop: "2rem" }}>
        <MemberList department="youth" />
      </div>

      {/* Attendance */}
      <div style={{ marginTop: "2rem" }}>
        <Attendance department="youth" />
      </div>
    </div>
  );
}