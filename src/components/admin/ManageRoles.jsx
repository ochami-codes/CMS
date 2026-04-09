// src/pages/admin/ManageRoles.jsx
import { useEffect, useState, useCallback } from "react";
import { AdminAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";
import { Check, X, RefreshCw } from "lucide-react";
import "../../styles/pages.css";

export default function ManageRoles() {
  const { user, setUser, loading: authLoading, rolesData, getRoleLabel } = useAuth();
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
          selectedRole: m.role_name,
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
    if (!authLoading && user?.church_id) {
      fetchMembers();
      fetchRoleRequests();
    }
  }, [authLoading, user?.church_id, fetchMembers, fetchRoleRequests]);

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

  /* ------------------ Role Request Actions ------------------ */
  const approveRole = async (request) => {
    setRequestProcessingId(request.id);
    try {
      await AdminAPI.approveRoleRequest(request.id);

      setRoleRequests((prev) =>
        prev.filter((r) => r.id !== request.id)
      );

      await fetchMembers();

      showToast(`Approved role request for ${request.user_full_name}`);
    } catch (err) {
      showToast("Failed to approve request", "error");
    } finally {
      setRequestProcessingId(null);
    }
  };

  const rejectRole = async (request) => {
    setRequestProcessingId(request.id);
    try {
      await AdminAPI.rejectRoleRequest(request.id);

      setRoleRequests((prev) =>
        prev.filter((r) => r.id !== request.id)
      );

      showToast(`Rejected role request for ${request.user_full_name}`);
    } catch (err) {
      showToast("Failed to reject request", "error");
    } finally {
      setRequestProcessingId(null);
    }
  };

  if (authLoading) return <div className="dashboard-content">Checking permissions…</div>;
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
        ) : (
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
              {members.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No members found
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id} style={!m.active ? { opacity: 0.6 } : {}}>
                    <td>{m.full_name}</td>
                    <td>
                      {Array.isArray(m.department)
                        ? m.department.join(", ")
                        : m.department || "-"}
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
                            .filter(r => r.name !== "admin" || user.roles.includes("admin"))
                            .map(r => (
                              <option key={r.name} value={r.name}>
                                {r.label}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <span style={{ opacity: 0.6 }}>—</span>
                      )}
                    </td>

                    <td className="dashboard-actions">
                      {m.is_system_user && (
                        <>
                          <button
                            className="btn btn-warning action-btn"
                            disabled={processingId === m.id || !m.active}
                            onClick={() => updateRole(m)}
                          >
                            <RefreshCw size={16} /> <span>Update</span>
                          </button>

                          <button
                            className={`btn ${m.active ? "btn-danger" : "btn-success"} action-btn`}
                            disabled={processingId === m.id}
                            onClick={() => toggleMember(m.id, m.active)}
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
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ------------------ Role Requests ------------------ */}
      <div className="card">
        <h3 className="card-title">Pending Role Requests</h3>

        {loadingRoleRequests ? (
          <div>Loading role requests…</div>
        ) : (
          <table className="members-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Requested Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {roleRequests.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No role requests
                  </td>
                </tr>
              ) : (
                roleRequests.map((r) => (
                  <tr key={r.id}>
                    <td>{r.user_full_name}</td>
                    <td>{getRoleLabel(r.role_name)}</td>
                    <td className="dashboard-actions">
                      <button
                        className="btn btn-success action-btn"
                        disabled={requestProcessingId === r.id}
                        onClick={() => approveRole(r)}
                      >
                        <Check size={16} /> <span>Approve</span>
                      </button>

                      <button
                        className="btn btn-danger action-btn"
                        disabled={requestProcessingId === r.id}
                        onClick={() => rejectRole(r)}
                      >
                        <X size={16} /> <span>Reject</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
