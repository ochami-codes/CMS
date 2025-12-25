import { useState } from "react";
import AddMember from "../../components/members/AddMember";
import MemberList from "../../components/members/MemberList";
import Attendance from "../../components/members/Attendance";
import "../../styles/global.css";

export default function YouthDashboard() {
  const [refreshList, setRefreshList] = useState(false);

  // Triggered after adding a member
  const handleMemberAdded = () => setRefreshList(prev => !prev);

  return (
    <div className="dashboard-layout" style={{ maxWidth: 1000, margin: "0 auto", padding: "1rem" }}>
      <h1 className="page-title" style={{ marginBottom: "0.2rem" }}>Youth Department</h1>
      <p className="page-subtext" style={{ marginBottom: "2rem", color: "#555" }}>
        Manage youth members, activities, attendance, and events.
      </p>

      {/* Quick stats / cards */}
      <div className="stats-grid" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {[
          { title: "Youth Members", desc: "View and manage all youths in the church." },
          { title: "Programs & Activities", desc: "Plan events, rallies, Bible study sessions." },
          { title: "Reports", desc: "Generate attendance and activity reports." }
        ].map((card, idx) => (
          <div key={idx} className="stat-card" style={{
            flex: "1 1 200px",
            padding: "1rem",
            background: "#f8f9fa",
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ marginBottom: "0.5rem" }}>{card.title}</h3>
            <p style={{ fontSize: "0.9rem", color: "#666" }}>{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Add Member Form */}
      <section style={{ marginBottom: "2rem" }}>
        <AddMember department="youth" onMemberAdded={handleMemberAdded} />
      </section>

      {/* Member List */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Youth Members</h2>
        <MemberList department="youth" refresh={refreshList} />
      </section>

      {/* Attendance */}
      <section style={{ marginBottom: "2rem" }}>
        <Attendance department="youth" />
      </section>
    </div>
  );
}