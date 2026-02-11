import ManageRoles from "./ManageRoles";
import RoleRequests from "./RoleRequests";
import "../../styles/pages.css";
export default function AdminContent({ activeTab }) {
  return (
    <>
      {activeTab === "manage" && <ManageRoles />}
      {activeTab === "requests" && <RoleRequests />}
    </>
  );
}
