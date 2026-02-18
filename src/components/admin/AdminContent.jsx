import ManageRoles from "./ManageRoles";
import RoleRequests from "./RoleRequests";
import MembershipRequests from "./MembershipRequests";
import NonMembers from "./NonMembers";
import "../../styles/pages.css";

export default function AdminContent({ activeTab }) {
  return (
    <>
      {activeTab === "manage" && <ManageRoles />}

      {activeTab === "non-members" && <NonMembers />}

      {activeTab === "membership-requests" && <MembershipRequests />}

      {activeTab === "role-requests" && <RoleRequests />}
    </>
  );
}
