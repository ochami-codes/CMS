// src/pages/youth/YouthDashboard.jsx
import { useState } from "react";
import AddMember from "../../components/members/AddMember";
import MemberList from "../../components/members/MemberList";
import Attendance from "../../components/members/Attendance";
import "../../styles/global.css";

export default function YouthDashboard() {
  const [refreshList, setRefreshList] = useState(false);

  // Call this to refresh the member list after adding a member
  const handleMemberAdded = () => {
    setRefreshList((prev) => !prev);
  };

  return (
    <div className="dashboard-layout">
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

      {/* Add Member Form */}
      <div style={{ marginTop: "2rem" }}>
        <AddMember department="youth" onMemberAdded={handleMemberAdded} />
      </div>

      {/* Member list */}
      <div style={{ marginTop: "2rem" }}>
        <MemberList department="youth" refresh={refreshList} />
      </div>

      {/* Attendance */}
      <div style={{ marginTop: "2rem" }}>
        <Attendance department="youth" />
      </div>
    </div>
  );
}