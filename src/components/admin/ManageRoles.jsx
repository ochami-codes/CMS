import { useEffect, useState, useCallback, useMemo } from "react";
import { Search } from "lucide-react";

import { AdminAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

import Button from "../Button";
import Loader from "../Loader";
import EmptyState from "../EmptyState";
import PageHeader from "../PageHeader";
import SearchBar from "../SearchBar";
import ResponsiveDataView from "../ResponsiveDataView";
import Modal from "../Modal";

import styles from "../../styles/admin/ManageRoles.module.css";

const SEARCH_DEBOUNCE_MS = 300;

export default function ManageRoles() {
  const { activeChurchId, getRoleLabel, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedMember, setSelectedMember] = useState(null);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const isProtectedMember = useCallback(
    (member) => isAdmin(member),
    [isAdmin]
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  // Load members
  const loadMembers = useCallback(async () => {
    if (!activeChurchId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({ search: debouncedSearch });
      const res = await AdminAPI.fetchMembers(params.toString());
      setMembers(res.members?? []);
    } catch {
      showToast("Failed to load members", "error");
    } finally {
      setLoading(false);
    }
  }, [activeChurchId, debouncedSearch, showToast]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  // Toggle activate/suspend/unsuspend
  const toggleMemberStatus = async (member) => {
    if (isProtectedMember(member)) {
      showToast("Admins cannot be modified", "error");
      return;
    }

    try {
      setProcessingId(member.id);

      if (member.status === "active") {
        setSuspendTarget(member);
      } else if (member.status === "suspended") {
        await AdminAPI.unsuspendMember(member.id);
        showToast("Member unsuspended", "success");
        await loadMembers();
      } else {
        await AdminAPI.activateMember(member.id);
        showToast("Member activated", "success");
        await loadMembers();
      }
    } catch {
      showToast("Action failed", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleSuspendConfirm = async () => {
    if (!suspendTarget) return;

    try {
      await AdminAPI.suspendMember(suspendTarget.id, {
        reason: suspendReason.trim() || undefined,
      });
      showToast("Member suspended", "success");
      setSuspendTarget(null);
      setSuspendReason("");
      await loadMembers();
    } catch {
      showToast("Failed to suspend member", "error");
    }
  };

  const handleSaveRoles = async () => {
    try {
      setSaving(true);
      // Add role update logic here
      showToast("Roles updated", "success");
      setSelectedMember(null);
    } catch {
      showToast("Failed to update roles", "error");
    } finally {
      setSaving(false);
    }
  };

  const getActionLabel = (status) => {
    if (status === "active") return "Suspend";
    if (status === "suspended") return "Unsuspend";
    return "Activate";
  };

  const getActionVariant = (status) => (status === "active"? "danger" : "success");

  const columns = useMemo(
    () => [
      { key: "full_name", label: "Member" },
      {
        key: "departments",
        label: "Departments",
        render: (m) => m.departments?.length? m.departments.join(", ") : "—",
      },
      {
        key: "status",
        label: "Status",
        render: (m) => {
          const className =
            m.status === "active"
             ? styles.active
              : m.status === "suspended"
             ? styles.suspended
              : styles.inactive;
          return <span className={className}>{m.status}</span>;
        },
      },
      {
        key: "roles",
        label: "Roles",
        render: (m) => (
          <div className={styles.roles}>
            {(m.roles?? []).map((role) => (
              <span key={role} className={styles.roleBadge}>
                {getRoleLabel(role)}
              </span>
            ))}
          </div>
        ),
      },
    ],
    [getRoleLabel]
  );

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

      {loading && <Loader message="Loading members..." />}

      {!loading && members.length === 0 && (
        <EmptyState
          title={debouncedSearch? "No members found" : "No members yet"}
          description={debouncedSearch? `No results for "${debouncedSearch}"` : undefined}
        />
      )}

      {!loading && members.length > 0 && (
        <ResponsiveDataView
          columns={columns}
          data={members}
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
                variant={getActionVariant(m.status)}
                size="sm"
                disabled={isProtectedMember(m)}
                onClick={() => toggleMemberStatus(m)}
              >
                {getActionLabel(m.status)}
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
              <Button variant="secondary" size="sm" onClick={() => setSelectedMember(null)}>
                Cancel
              </Button>
              <Button size="md" loading={saving} onClick={handleSaveRoles}>
                Save Changes
              </Button>
            </>
          }
        >
          <div>Role selection UI goes here</div>
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
