import { useState, useCallback } from "react";
import { Search } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

import Button from "../Button";
import Loader from "../Loader";
import EmptyState from "../EmptyState";
import PageHeader from "../PageHeader";
import SearchBar from "../SearchBar";
import ResponsiveDataView from "../ResponsiveDataView";
import ManageRolesModal from "./ManageRolesModal";
import ErrorState from "../../components/ErrorState"
import SuspendMemberModal from "./SuspendMemberModal";
import { useAdminMembers } from "../../hooks/admin/useAdminMembers";
import { useRoles } from "../../hooks/admin/useRoles";
import { useAdminMemberActions } from "../../hooks/admin/useAdminMemberAction";

import styles from "../../styles/admin/ManageRoles.module.css";

export default function ManageRoles() {
  const { activeChurchId, getRoleLabel } = useAuth();
  const { showToast } = useToast();

  // UI state
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [suspendTarget, setSuspendTarget] = useState(null);

  // Data hooks
  const {
  members,
  initialLoading,
  refreshing,
  isError: membersIsError,
  error: membersError,
  refetch: refetchMembers,
} = useAdminMembers(
  activeChurchId,
  search
);
  const {
  roles,
  loading: rolesLoading,
  isError: rolesIsError,
  error: rolesError,
  refetch: refetchRoles,
} = useRoles();

  const {
    processingId,
    saving,
    suspendMember,
    unsuspendMember,
    activateMember,
    updateRoles,
  } = useAdminMemberActions(activeChurchId, showToast);

  // Helpers
  const isProtectedMember = useCallback(
    (member) => (member.roles ?? []).includes("admin"),
    []
  );

  const handleSaveRoles = async ({memberId, roles}) => {
    await updateRoles({memberId, roles});
    setSelectedMember(null);
  };

  const handleSuspendConfirm = async ({ memberId, reason }) => {
    await suspendMember({memberId, reason});
    setSuspendTarget(null);
  };

  const toggleMemberStatus = async (member) => {
    if (isProtectedMember(member)) {
      return showToast("Admins cannot be modified", "error");
    }

    if (member.status === "active") {
      setSuspendTarget(member);
    } else if (member.status === "suspended") {
      await unsuspendMember({memberId: member.id});
    } else {
      await activateMember({memberId: member.id});
    }
  };

  const columns = [
    {
      key: "full_name",
      label: "Member",
    },
    {
      key: "departments",
      label: "Departments",
      render: (departments) =>
        departments?.length ? departments.join(", ") : "—",
    },
    {
      key: "status",
      label: "Status",
      render: (status) => (
        <span className={styles[status]}>{status}</span>
      ),
    },
    {
      key: "roles",
      label: "Roles",
      render: (roles) => (
        <div className={styles.roles}>
          {(roles ?? []).map((role) => (
            <span key={role} className={styles.roleBadge}>
              {getRoleLabel(role)}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.section}>
      <PageHeader
        title="Members & Roles"
        subtitle="Manage members, permissions, and access"
      />

      <SearchBar
        value={search}
        icon={<Search size={16} />}
        placeholder="Search members..."
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch("")}
      />
      {!initialLoading && membersIsError && (
  <ErrorState
    title="Unable to load members"
    message={
      membersError?.message ??
      "We couldn't load the members. Please try again."
    }
    onRetry={refetchMembers}
  />
)}

     {!initialLoading &&
  !membersIsError &&
  members.length === 0 && (
    <EmptyState
      title={
        search
          ? "No members found"
          : "No members yet"
      }
      description={
        search
          ? `No results for "${search}"`
          : undefined
      }
    />
  )}

      {!initialLoading && !membersIsError && members.length > 0 && (
        <ResponsiveDataView
          columns={columns}
          data={members}
          refreshing={refreshing}
          renderActions={(m) => (
            <>
              <Button
                variant="secondary"
                size="sm"
                disabled={isProtectedMember(m)}
                onClick={() => setSelectedMember(m)}
              >
                Manage Roles
              </Button>
              <Button
                loading={processingId === m.id}
                variant={m.status === "active" ? "danger" : "success"}
                size="sm"
                disabled={isProtectedMember(m)}
                onClick={() => toggleMemberStatus(m)}
              >
                {m.status === "active"
                  ? "Suspend"
                  : m.status === "suspended"
                  ? "Unsuspend"
                  : "Activate"}
              </Button>
            </>
          )}
        />
      )}

      {/* Role Modal */}
      <ManageRolesModal
  member={selectedMember}
  roles={roles}
  rolesLoading={rolesLoading}
  rolesError={rolesError}
  rolesIsError={rolesIsError}
  onRetryRoles={refetchRoles}
  saving={saving}
  onClose={() => setSelectedMember(null)}
  onSave={handleSaveRoles}
/>

      {/* Suspend Modal */}
      <SuspendMemberModal
        member={suspendTarget}
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleSuspendConfirm}
      />
    </div>
  );
}