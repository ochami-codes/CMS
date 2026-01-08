// src/pages/youth/YouthDashboard.jsx
import { useState } from "react";
import AddMember from "../../components/members/AddMember";
import MemberList from "../../components/members/MemberList";
import Attendance from "../../components/members/Attendance";
import "../../styles/global.css";

export default function YouthDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMemberAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="dashboard-layout" style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem" }}>
      <h1 className="page-title">Youth Department</h1>
      <p className="page-subtext">
        Manage youth members, programs, and attendance records.
      </p>

      {/* Overview cards */}
      <div className="stats-grid" style={{ marginTop: "1.5rem", marginBottom: "2.5rem" }}>
        <div className="stat-card">
          <h3>Youth Members</h3>
          <p>Register and manage youth membership.</p>
        </div>

        <div className="stat-card">
          <h3>Programs & Activities</h3>
          <p>Track youth events, fellowships, and outreach.</p>
        </div>

        <div className="stat-card">
          <h3>Attendance</h3>
          <p>Record Sabbath and program attendance.</p>
        </div>
      </div>

      {/* Add Member */}
      <section style={{ marginBottom: "2.5rem" }}>
        <AddMember
          department="youth"
          onMemberAdded={handleMemberAdded}
        />
      </section>

      {/* Member List */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="section-title">Youth Members</h2>
        <MemberList
          department="youth"
          refreshKey={refreshKey}
        />
      </section>

      {/* Attendance */}
      <section>
        <h2 className="section-title">Attendance</h2>
        <Attendance department="youth" />
      </section>
    </div>
  );
}