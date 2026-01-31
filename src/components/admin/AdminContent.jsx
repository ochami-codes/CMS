import ManageRoles from "./ManageRoles";
import RoleRequests from "./RoleRequests";

export default function AdminContent({ activeTab }) {
  return (
    <div className="card">
      {activeTab === "manage" && <ManageRoles />}
      {activeTab === "requests" && <RoleRequests />}
    </div>
  );
}
