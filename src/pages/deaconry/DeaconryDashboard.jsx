
import { useAuth } from "../../context/AuthContext";
import MemberList from "../../components/members/MemberList";
import Attendance from "../../components/members/Attendance";


export default function DeaconryDashboard() {
  const { user } = useAuth(); // use normalized user

  return (
    <main className="page-container space-y-6">

      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-title">Deaconry Department</h1>
        <p className="text-muted">
          Manage deaconry members, programs, and attendance records.
        </p>
      </header>

      {/* Overview Cards */}
      <section className="stats-grid">
        <div className="page-card">
          <h3 className="card-subtitle">Deaconry Members</h3>
          <p className="text-muted">
            Register and manage deaconry membership.
          </p>
        </div>

        <div className="page-card">
          <h3 className="card-subtitle">Programs & Activities</h3>
          <p className="text-muted">
            Track Deaconry events, fellowships, and outreach.
          </p>
        </div>

        <div className="page-card">
          <h3 className="card-subtitle">Attendance</h3>
          <p className="text-muted">
            Record Sabbath and program attendance.
          </p>
        </div>
      </section>


      {/* Member List */}
      <section className="page-card">
        <MemberList
          department="deaconry"
          currentUser={user} // now uses normalized user
        />
      </section>

     /* {/* Attendance */}
      <section className="page-card">
        <Attendance department="deaconry" />
      </section>*/

    </main>
  );
}
