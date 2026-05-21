// src/pages/choir/ChoirDashboard.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import AddMember from "../../components/members/AddMember";
import MemberList from "../../components/members/MemberList";
import Attendance from "../../components/members/Attendance";


export default function ChoirDashboard() {
  const { user } = useAuth(); // use normalized user
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMemberAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className="page-container space-y-6">

      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-title">Choir Department</h1>
        <p className="text-muted">
          Manage choir members, programs, and attendance records.
        </p>
      </header>

      {/* Overview Cards */}
      <section className="stats-grid">
        <div className="page-card">
          <h3 className="card-subtitle">Choir Members</h3>
          <p className="text-muted">
            Register and manage choir membership.
          </p>
        </div>

        <div className="page-card">
          <h3 className="card-subtitle">Programs & Activities</h3>
          <p className="text-muted">
            Track choir events, fellowships, and outreach.
          </p>
        </div>

        <div className="page-card">
          <h3 className="card-subtitle">Attendance</h3>
          <p className="text-muted">
            Record Sabbath and program attendance.
          </p>
        </div>
      </section>

      {/* Add Member Form */}
      <section className="page-card">
        <AddMember
          department="choir"
          onMemberAdded={handleMemberAdded}
        />
      </section>

      {/* Member List */}
      <section className="page-card">
        <MemberList
          department="choir"
          refreshKey={refreshKey}
          currentUser={user} // now uses normalized user
        />
      </section>

     /* {/* Attendance */}
      <section className="page-card">
        <Attendance department="choir" />
      </section>*/

    </main>
  );
}
