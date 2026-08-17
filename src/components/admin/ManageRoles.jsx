import { useState, useCallback } from "react";
import { Search } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

import Button from "../Button";
import EmptyState from "../EmptyState";
import PageHeader from "../PageHeader";
import SearchBar from "../SearchBar";
import ResponsiveDataView from "../ResponsiveDataView";
import ManageRolesModal from "./ManageRolesModal";
import ErrorState from "../../components/ErrorState";
import SuspendMemberModal from "./SuspendMemberModal";

import { useAdminMembers } from "../../hooks/admin/useAdminMembers";
import BadgeList from "../BadgeList";
import { useAdminMemberActions } from "../../hooks/admin/useAdminMemberAction";

import styles from "../../styles/admin/ManageRoles.module.css";

export default function ManageRoles() {
  const { activeChurchId } = useAuth();
  const { showToast } = useToast();

  // -------------------------
  // UI State
  // -------------------------
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [suspendTarget, setSuspendTarget] = useState(null);

  // -------------------------
  // Members
  // -------------------------
  const {
    members,
    initialLoading,
    refreshing,
    isError: membersIsError,
    error: membersError,
    refetch: refetchMembers,
  } = useAdminMembers(activeChurchId, search);

  // -------------------------
  // Member Actions
  // -------------------------
  const {
    processingId,
    saving,
    suspendMember,
    unsuspendMember,
    processing,
    activateMember,
    updateRoles,
  } = useAdminMemberActions(activeChurchId, showToast);

  // -------------------------
  // Helpers
  // -------------------------
  const isProtectedMember = useCallback(
    (member) => (member.roles ?? []).some((role) => role.name === "admin"),
    []
  );

  // -------------------------
  // Role Update
  // -------------------------
  const handleSaveRoles = async ({ memberId, roles }) => {
    await updateRoles({ memberId, roles });
    setSelectedMember(null);
  };

  // -------------------------
  // Suspend
  // -------------------------
  const handleSuspendConfirm = async ({ memberId, reason }) => {
    await suspendMember({ memberId, reason });
    setSuspendTarget(null);
  };

  // -------------------------
  // Toggle Member Status
  // -------------------------
  const toggleMemberStatus = async (member) => {
    if (isProtectedMember(member)) {
      return showToast("Admins cannot be modified", "error");
    }

    if (member.status === "active") {
      setSuspendTarget(member);
      return;
    }

    if (member.status === "suspended") {
      await unsuspendMember({ memberId: member.id });
      return;
    }

    await activateMember({ memberId: member.id });
  };

  // -------------------------
  // Table Columns
  // -------------------------
  const columns = [
    { key: "full_name", label: "Member" },
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
    <BadgeList
      items={roles}
      getKey={(role) => role.name}
      getLabel={(role) => role.label}
    />
  ),
},
  ];

  return (
    <div className={styles.section}>
      <PageHeader
        title="Members & Roles"
        subtitle="Manage members, permissions, and access"
      />

      {/* Search */}
      <SearchBar
        value={search}
        icon={<Search size={16} />}
        placeholder="Search members..."
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch("")}
      />

      {/* Members Error */}
      {!initialLoading && membersIsError && (
     <ErrorState
  error={membersError}
  title="Failed to load data"
  message={membersError?.message}
  onRetry={refetchMembers}
/>
      )}

      {/* Empty State */}
      {!initialLoading && !membersIsError && members.length === 0 && (
        <EmptyState
          title={search ? "No members found" : "No members yet"}
          description={search ? `No results for "${search}"` : undefined}
        />
      )}

      {/* Members */}
      {!initialLoading && !membersIsError && members.length > 0 && (
        <ResponsiveDataView
          columns={columns}
          data={members}
          refreshing={refreshing}
          renderActions={(member) => (
            <>
              <Button
                variant="secondary"
                size="sm"
                disabled={isProtectedMember(member)}
                onClick={() => setSelectedMember(member)}
              >
                Manage Roles
              </Button>

              <Button
                loading={processingId === member.id}
                variant={member.status === "active" ? "danger" : "success"}
                size="sm"
                disabled={isProtectedMember(member)}
                onClick={() => toggleMemberStatus(member)}
              >
                {member.status === "active"
                  ? "Suspend"
                  : member.status === "suspended"
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
        saving={saving}
        onClose={() => setSelectedMember(null)}
        onSave={handleSaveRoles}
      />

      {/* Suspend Modal */}
      <SuspendMemberModal
        member={suspendTarget}
        isSuspending={processing}
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleSuspendConfirm}
      />
    </div>
  );
}
