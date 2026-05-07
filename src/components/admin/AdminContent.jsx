import ManageRoles from "./ManageRoles";
import RoleRequests from "./RoleRequests";
import MembershipRequests from "./MembershipRequests";
import "../../styles/pages.css";

export default function AdminContent({ activeTab }) {
  return (
    <>
      {activeTab === "manage" && <ManageRoles />}

      {activeTab === "membership-requests" && <MembershipRequests />}

      {activeTab === "role-requests" && <RoleRequests />}
    </>
  );
}
