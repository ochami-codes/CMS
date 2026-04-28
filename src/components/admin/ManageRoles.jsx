// src/pages/admin/ManageRoles.jsx
import { useEffect, useState, useCallback } from "react";
import { AdminAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";
import { Check, X, RefreshCw } from "lucide-react";
import "../../styles/pages.css";
import "../../styles/tables.css";

export default function ManageRoles() {
  const { user, setUser,  rolesData, getRoleLabel } = useAuth();
  const { showToast } = useToast();

  const [members, setMembers] = useState([]);
  const [roleRequests, setRoleRequests] = useState([]);

  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingRoleRequests, setLoadingRoleRequests] = useState(true);

  const [processingId, setProcessingId] = useState(null);
  const [requestProcessingId, setRequestProcessingId] = useState(null);
  const [search, setSearch] = useState("");

  /* ------------------ Fetch Members ------------------ */
  const fetchMembers = useCallback(async () => {
    if (!user?.church_id) return;

    setLoadingMembers(true);
    try {
      const params = new URLSearchParams({ search }).toString();
      const data = await AdminAPI.fetchMembers(params);

setMembers(
  (data.members ?? []).map((m) => ({
    ...m,
    role_name: m.primary_role,          // normalize
    department: m.departments ?? [],    // normalize
    selectedRole: m.primary_role,
  }))
);
 } catch (err) {
      showToast("Failed to load members", "error");
    } finally {
      setLoadingMembers(false);
    }
  }, [user?.church_id, search, showToast]);

  /* ------------------ Fetch Role Requests ------------------ */
  const fetchRoleRequests = useCallback(async () => {
    if (!user?.church_id) return;

    setLoadingRoleRequests(true);
    try {
      const data = await AdminAPI.fetchRoleRequests();
      setRoleRequests(
        (data.requests ?? []).map(r => ({
          ...r,
          selectedRole: r.role_name
        }))
      );
    } catch (err) {
      showToast("Failed to load role requests", "error");
    } finally {
      setLoadingRoleRequests(false);
    }
  }, [user?.church_id, showToast]);

  /* ------------------ Initial Load ------------------ */
  useEffect(() => {
    if ( user?.church_id) {
      fetchMembers();
      fetchRoleRequests();
    }
  }, [user?.church_id, fetchMembers, fetchRoleRequests]);

  /* ------------------ Member Actions ------------------ */
  const updateRole = async (member) => {
    if (member.selectedRole === member.role_name) return;

    setProcessingId(member.id);
    try {
      await AdminAPI.updateMemberRole(member.id, member.selectedRole);

      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id ? { ...m, role_name: member.selectedRole } : m
        )
      );

      if (member.id === user.id) {
        setUser((u) => ({ ...u, role_name: member.selectedRole }));
      }

      showToast("Role updated successfully");
    } catch (err) {
      showToast("Failed to update role", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const toggleMember = async (id, active) => {
    if (!window.confirm(active ? "Deactivate this member?" : "Activate this member?"))
      return;

    setProcessingId(id);
    try {
      active
        ? await AdminAPI.deactivateMember(id)
        : await AdminAPI.activateMember(id);

      setMembers((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, active: !active } : m
        )
      );

      showToast(active ? "Member deactivated" : "Member activated");
    } catch (err) {
      showToast("Action failed", "error");
    } finally {
      setProcessingId(null);
    }
  };
  if (!user) return <div className="dashboard-content">Loading profile…</div>;

  return (
    <>
      {/* ------------------ Search & Members ------------------ */}
      <div className="card">
        <h2 className="card-title">Admin Members & Roles</h2>
        <input
          placeholder="Search members…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />
      </div>
<div className="card">
  <h3 className="card-title">Manage Members</h3>

  {loadingMembers ? (
    <div>Loading members…</div>
  ) : members.length === 0 ? (
    <div style={{ textAlign: "center" }}>No members found</div>
  ) : (
    <>
      {/* ---------------- DESKTOP TABLE ---------------- */}
      <div className="desktop-table">
      <div className="table-scroll">
        <table className="members-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Status</th>
              <th>Role</th>
              <th>New Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.map((m) => (
              <tr key={m.id} style={!m.active ? { opacity: 0.6 } : {}}>
                <td>{m.full_name}</td>

                <td>
                  {m.department.length > 0
                    ? m.department.join(", ")
                    : "-"}
                </td>

                <td>{m.active ? "Active" : "Inactive"}</td>

                <td>{getRoleLabel(m.role_name)}</td>

                <td>
                  {m.is_system_user ? (
                    <select
                      value={m.selectedRole}
                      disabled={!m.active}
                      onChange={(e) =>
                        setMembers((prev) =>
                          prev.map((x) =>
                            x.id === m.id
                              ? { ...x, selectedRole: e.target.value }
                              : x
                          )
                        )
                      }
                    >
                      {rolesData.roles
                        .filter(
                          (r) =>
                            r.name !== "admin" ||
                            user.roles.includes("admin")
                        )
                        .map((r) => (
                          <option key={r.name} value={r.name}>
                            {r.label}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <span style={{ opacity: 0.6 }}>—</span>
                  )}
                </td>

                <td className="actions">
                  {m.is_system_user && (
                    <>
                      <button
                        className="btn btn-warning action-btn"
                        disabled={
                          processingId === m.id || !m.active
                        }
                        onClick={() => updateRole(m)}
                      >
                        <RefreshCw size={16} /> <span>Update</span>
                      </button>

                      <button
                        className={`btn ${
                          m.active ? "btn-danger" : "btn-success"
                        } action-btn`}
                        disabled={processingId === m.id}
                        onClick={() =>
                          toggleMember(m.id, m.active)
                        }
                      >
                        {m.active ? (
                          <>
                            <X size={16} /> <span>Deactivate</span>
                          </>
                        ) : (
                          <>
                            <Check size={16} /> <span>Activate</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      {/* ---------------- MOBILE CARDS ---------------- */}
      <div className="mobile-cards">
        {members.map((m) => (
          <div
            key={m.id}
            className="member-card"
            style={!m.active ? { opacity: 0.6 } : {}}
          >
            <h3>{m.full_name}</h3>

            <p>
              <strong>Department:</strong>{" "}
              {m.department.length > 0
                ? m.department.join(", ")
                : "-"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {m.active ? "Active" : "Inactive"}
            </p>

            <p>
              <strong>Role:</strong>{" "}
              {getRoleLabel(m.role_name)}
            </p>

            {m.is_system_user && (
              <select
                value={m.selectedRole}
                disabled={!m.active}
                onChange={(e) =>
                  setMembers((prev) =>
                    prev.map((x) =>
                      x.id === m.id
                        ? {
                            ...x,
                            selectedRole: e.target.value,
                          }
                        : x
                    )
                  )
                }
              >
                {rolesData.roles
                  .filter(
                    (r) =>
                      r.name !== "admin" ||
                      user.roles.includes("admin")
                  )
                  .map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.label}
                    </option>
                  ))}
              </select>
            )}

            <div className="card-actions">
              {m.is_system_user && (
                <>
                  <button
                    className="btn btn-warning"
                    disabled={
                      processingId === m.id || !m.active
                    }
                    onClick={() => updateRole(m)}
                  >
                    Update
                  </button>

                  <button
                    className={`btn ${
                      m.active ? "btn-danger" : "btn-success"
                    }`}
                    disabled={processingId === m.id}
                    onClick={() =>
                      toggleMember(m.id, m.active)
                    }
                  >
                    {m.active ? "Deactivate" : "Activate"}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )}
</div>
    </>
  );
}
