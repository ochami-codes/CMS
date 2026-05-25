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
  const { activeChurchId, getRoleLabel } = useAuth();
  const { showToast } = useToast();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search]);

  const loadMembers = useCallback(async () => {
    if (!activeChurchId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({ search: debouncedSearch });
      const res = await AdminAPI.fetchMembers(params.toString());
      setMembers(res.members || []);
    } catch {
      showToast("Failed loading members", "error");
    } finally {
      setLoading(false);
    }
  }, [activeChurchId, debouncedSearch, showToast]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const toggleMember = async (member) => {
    try {
      setProcessingId(member.id);

      if (member.active) {
        await AdminAPI.deactivateMember(member.id);
      } else {
        await AdminAPI.activateMember(member.id);
      }

      await loadMembers();
      showToast("Member updated", "success");
    } catch {
      showToast("Action failed", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const closeModal = () => setSelectedMember(null);

  const handleSave = async () => {
    try {
      setSaving(true);
      // save roles here
      showToast("Roles updated", "success");
      closeModal();
    } catch {
      showToast("Failed updating roles", "error");
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(
    () => [
      { key: "full_name", label: "Member" },
      {
        key: "departments",
        label: "Departments",
        render: (m) => (m.departments?.length? m.departments.join(", ") : "-"),
      },
      {
        key: "active",
        label: "Status",
        render: (m) => (
          <span className={m.active? styles.active : styles.inactive}>
            {m.active? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        key: "roles",
        label: "Roles",
        render: (m) => (
          <div className={styles.roles}>
            {(m.roles || []).map((role) => (
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
        subtitle="Manage members, permissions and access"
      />

      <SearchBar
        value={search}
        icon={<Search size={16} />}
        placeholder="Search members..."
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch("")}
      />

      {loading && (
  <Loader
    fullScreen={false}
    message="Loading members..."
  />
)}

      {!loading && members.length === 0 && (
        <EmptyState
          title={debouncedSearch? "No members found" : "No members yet"}
          description={
            debouncedSearch
             ? `No results for "${debouncedSearch}"`
              : undefined
          }
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
                onClick={() => setSelectedMember(m)}
              >
                Manage Roles
              </Button>

              <Button
                loading={processingId === m.id}
                variant={m.active? "danger" : "success"}
                size="sm"
                onClick={() => toggleMember(m)}
              >
                {m.active? "Deactivate" : "Activate"}
              </Button>
            </>
          )}
        />
      )}

      {selectedMember && (
        <Modal
          open={!!selectedMember}
          onClose={closeModal}
          title={`Manage Roles: ${selectedMember.full_name}`}
          size="lg"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={handleSave} size="md" loading={saving}>
                Save Changes
              </Button>
            </>
          }
        >
          {/* Roles UI here */}
        </Modal>
      )}
    </div>
  );
}
