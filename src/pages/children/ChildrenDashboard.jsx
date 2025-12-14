import MemberList from "../../components/members/MemberList";
import Attendance from "../../components/members/Attendance";
import "../../styles/dashboard.css";
export default function ChildrenDashboard() {
  return (
    <div className="dashboard-layout">
      <h1 className="page-title">Children Department</h1>
      <p className="page-subtext">
        Manage children members, activities, attendance, and events.
      </p>

      {/* Quick stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Children Members</h3>
          <p>View and manage all children in the church.</p>
        </div>

        <div className="stat-card">
          <h3>Programs & Activities</h3>
          <p>Plan Bible study, Sabbath school, and other programs.</p>
        </div>

        <div className="stat-card">
          <h3>Reports</h3>
          <p>Generate attendance and activity reports.</p>
        </div>
      </div>

      {/* Member list CRUD */}
      <div style={{ marginTop: "2rem" }}>
        <MemberList department="children" />
      </div>

      {/* Attendance */}
      <div style={{ marginTop: "2rem" }}>
        <Attendance department="children" />
      </div>
    </div>
  );
}
