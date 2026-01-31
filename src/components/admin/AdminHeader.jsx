export default function AdminHeader() {
  return (
    <div className="greeting-card">
      <h2>Welcome, Admin!</h2>
      <p>
        Use this dashboard to:
        <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem" }}>
          <li>✔ Manage church members</li>
          <li>✔ Approve or reject role requests</li>
          <li>✔ Assign roles and permissions</li>
        </ul>
      </p>
    </div>
  );
}
