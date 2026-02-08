// src/pages/youth/YouthDashboard.jsx
import { useState } from "react";
import AddMember from "../../components/members/AddMember";
import MemberList from "../../components/members/MemberList";
import Attendance from "../../components/members/Attendance";

export default function YouthDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMemberAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Youth Department</h1>
        <p className="text-gray-700 text-sm">
          Manage youth members, programs, and attendance records.
        </p>
      </header>

      {/* Overview Cards */}
      <div className="stats-grid mb-8">
        <div className="stat-card card p-4">
          <h3 className="font-semibold mb-1">Youth Members</h3>
          <p className="text-gray-700 text-sm">Register and manage youth membership.</p>
        </div>

        <div className="stat-card card p-4">
          <h3 className="font-semibold mb-1">Programs & Activities</h3>
          <p className="text-gray-700 text-sm">Track youth events, fellowships, and outreach.</p>
        </div>

        <div className="stat-card card p-4">
          <h3 className="font-semibold mb-1">Attendance</h3>
          <p className="text-gray-700 text-sm">Record Sabbath and program attendance.</p>
        </div>
      </div>

      {/* Add Member */}
      <section className="mb-8">
        <AddMember department="youth" onMemberAdded={handleMemberAdded} />
      </section>

      {/* Member List */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Youth Members</h2>
        <MemberList department="youth" refreshKey={refreshKey} />
      </section>

      {/* Attendance */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Attendance</h2>
        <Attendance department="youth" />
      </section>
    </div>
  );
}
