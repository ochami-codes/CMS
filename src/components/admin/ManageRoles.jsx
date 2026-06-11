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
import Modal from "../Modal";
import RoleSelector from "../RoleSelector";

import { useDebouncedValue } from "../../hooks/admin/useDebouncedValue";
import { useAdminMembers } from "../../hooks/admin/useAdminMembers";
import { useRoles } from "../../hooks/admin/useRoles";
import { useAdminMemberActions } from "../../hooks/admin/useAdminMemberAction";

import styles from "../../styles/admin/ManageRoles.module.css";

export default function ManageRoles() {
  const { activeChurchId, getRoleLabel } = useAuth();
  const { showToast } = useToast();

  // UI state only
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const [selectedMember, setSelectedMember] = useState(null);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  // data hooks
  const {
    members,
    initialLoading,
    refreshing,
    reload,
  } = useAdminMembers(activeChurchId, debouncedSearch);

  const { roles, loading: rolesLoading } = useRoles();

  const {
    processingId,
    setProcessingId,
    saving,
    suspendMember,
    unsuspendMember,
    activateMember,
    updateRoles,
  } = useAdminMemberActions(reload, showToast);

  // protected members
  const isProtectedMember = useCallback(
    (member) =>
      (member.roles ?? []).some(
        (role) => role === "admin" || role === "super_admin"
      ),
    []
  );

  // sync selected roles
  const openRoleModal = (member) => {
    setSelectedMember(member);
    setSelectedRoles(member.roles ?? []);
  };


  const handleSaveRoles = async () => {
    await updateRoles(selectedMember.id, selectedRoles);
    setSelectedMember(null);
  };

  const toggleMemberStatus = async (member) => {
    if (isProtectedMember(member)) return showToast("Admins cannot be modified", "error");

    setProcessingId(member.id);

    try {
      if (member.status === "active") {
        setSuspendTarget(member);
      } else if (member.status === "suspended") {
        await unsuspendMember(member.id);
      } else {
        await activateMember(member.id);
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleSuspendConfirm = async () => {
    if (!suspendTarget) return;

    await suspendMember(suspendTarget.id, suspendReason);

    setSuspendTarget(null);
    setSuspendReason("");
  };

  const columns = [
    { key: "full_name", label: "Member" },
    {
      key: "departments",
      label: "Departments",
      render: (m) => m.departments?.length ? m.departments.join(", ") : "—",
    },
    {
      key: "status",
      label: "Status",
      render: (m) => (
        <span className={styles[m.status]}>
          {m.status}
        </span>
      ),
    },
    {
      key: "roles",
      label: "Roles",
      render: (m) => (
        <div className={styles.roles}>
          {(m.roles ?? []).map((role) => (
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

      {initialLoading && <Loader
       fullScreen={false}
       message="Loading members..." />}

      {!initialLoading && members.length === 0 && (
        <EmptyState
          title={debouncedSearch ? "No members found" : "No members yet"}
          description={
            debouncedSearch ? `No results for "${debouncedSearch}"` : undefined
          }
        />
      )}

      {!initialLoading && members.length > 0 && (
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
                onClick={() => openRoleModal(m)}
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
      {selectedMember && (
        <Modal
  open
  onClose={() => setSelectedMember(null)}
  title={`Manage Roles: ${selectedMember.full_name}`}
  size="lg"
  footer={
    <>
      <Button
        variant="secondary"
        onClick={() => setSelectedMember(null)}
      >
        Cancel
      </Button>

      <Button
        loading={saving}
        onClick={handleSaveRoles}
      >
        Save Changes
      </Button>
    </>
  }
>
  <RoleSelector
    roles={roles}
    loading={rolesLoading}
    selectedRoles={selectedRoles}
    onChange={setSelectedRoles}
    getRoleLabel={getRoleLabel}
    multiple
  />
</Modal>
      )}

      {/* Suspend Modal */}
      {suspendTarget && (
        <Modal
          open
          onClose={() => {
            setSuspendTarget(null);
            setSuspendReason("");
          }}
          title={`Suspend ${suspendTarget.full_name}`}
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setSuspendTarget(null);
                  setSuspendReason("");
                }}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleSuspendConfirm}>
                Confirm Suspend
              </Button>
            </>
          }
        >
          <textarea
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            placeholder="Reason (optional)"
            rows={4}
            style={{ width: "100%" }}
          />
        </Modal>
      )}
    </div>
  );
}
