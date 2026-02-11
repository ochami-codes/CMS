import "../../styles/pages.css";
export default function AdminHeader() {
  return (
    <div className="card">
      <h2 className="card-title">Welcome, Admin!</h2>

      <p className="card-subtitle">
        Use this dashboard to:
      </p>

      <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
        <li>✔ Manage church members</li>
        <li>✔ Approve or reject role requests</li>
        <li>✔ Assign roles and permissions</li>
      </ul>
    </div>
  );
}
