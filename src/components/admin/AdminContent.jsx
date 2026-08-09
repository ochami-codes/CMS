import ManageRoles from "./ManageRoles";
import RoleRequests from "./RoleRequests";
import MembershipRequests from "./MembershipRequests";
import ManageDepartments from "./ManageDepartments";
import EmptyState from "../EmptyState";

import styles from "../../styles/admin/AdminContent.module.css";

const TABS = {
  manage: ManageRoles,
  "membership-requests": MembershipRequests,
  "role-requests": RoleRequests,
  "manage-departments": ManageDepartments,
};

export default function AdminContent({ activeTab }) {
  const ActiveComponent = TABS[activeTab];

  if (!ActiveComponent) {
    return (
      <EmptyState
        title="Unknown section"
        description="Please select a valid tab."
      />
    );
  }

  return (
    <div className={styles.container}>
      <ActiveComponent />
    </div>
  );
}
