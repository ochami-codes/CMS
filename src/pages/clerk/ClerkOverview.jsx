export default function ClerkOverview() {
  return (
    <div className="page-card">

      <h2 className="card-title">📊 Church Overview</h2>

      <div className="overview-grid">

        <div className="overview-card">
          <h3>Total Members</h3>
          <p>--</p>
        </div>

        <div className="overview-card">
          <h3>Active Members</h3>
          <p>--</p>
        </div>

        <div className="overview-card">
          <h3>Pending Transfers</h3>
          <p>--</p>
        </div>

        <div className="overview-card">
          <h3>Missing Members</h3>
          <p>--</p>
        </div>

      </div>

    </div>
  );
}
