import { useEffect, useState, useCallback } from "react";
import { AdminAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const ROLES = [
  "Admin",
  "Pastor",
  "Treasurer",
  "Children_leader",
  "Youth_leader",
  "Communication_leader",
  "Member",
];

export default function ManageRoles() {
  const { profile, setProfile, setUser, loading: authLoading } = useAuth();

  const [members, setMembers] = useState([]);
  const [roleRequests, setRoleRequests] = useState([]);

  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const [processingId, setProcessingId] = useState(null);
  const [requestProcessingId, setRequestProcessingId] = useState(null);

  const [search, setSearch] = useState("");

  const fetchMembers = useCallback(async () => {
    if (!profile?.church_id) return;

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
    } finally {
      setLoadingMembers(false);
    }
  }, [profile, search]);

  const fetchRoleRequests = useCallback(async () => {
    if (!profile?.church_id) return;

    setLoadingRequests(true);
    try {
      const data = await AdminAPI.fetchRoleRequests();
      setRoleRequests(data.requests ?? []);
    } finally {
      setLoadingRequests(false);
    }
  }, [profile]);

  useEffect(() => {
    if (!authLoading && profile?.church_id) {
      fetchMembers();
      fetchRoleRequests();
    }
  }, [authLoading, profile, fetchMembers, fetchRoleRequests]);

  const updateRole = async (member) => {
    if (member.selectedRole === member.role_name) return;

    setProcessingId(member.id);
    try {
      await AdminAPI.updateMemberRole(member.id, member.selectedRole);

      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id
            ? { ...m, role_name: member.selectedRole }
            : m
        )
      );

      if (member.id === profile.id) {
        setProfile((p) => ({ ...p, role_name: member.selectedRole }));
        setUser((u) => ({ ...u, role_name: member.selectedRole }));
      }
    } finally {
      setProcessingId(null);
    }
  };

  const toggleMember = async (id, active) => {
    if (!confirm(active ? "Deactivate this member?" : "Activate this member?"))
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
    } finally {
      setProcessingId(null);
    }
  };

  const approveRequest = async (id) => {
    setRequestProcessingId(id);
    await AdminAPI.approveRoleRequest(id);
    await fetchMembers();
    await fetchRoleRequests();
    setRequestProcessingId(null);
  };

  const rejectRequest = async (id) => {
    setRequestProcessingId(id);
    await AdminAPI.rejectRoleRequest(id);
    await fetchRoleRequests();
    setRequestProcessingId(null);
  };

  if (authLoading) return <div>Checking permissions…</div>;
  if (!profile) return <div>Loading profile…</div>;

  return (
    <div className="dashboard-content">
      <h2>Manage Members & Roles</h2>

      <input
        placeholder="Search members…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Members */}
      <div className="card">
        {loadingMembers ? (
          <div>Loading members…</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Current Role</th>
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
                    <td>{m.department || "-"}</td>
                    <td>{m.active ? "Active" : "Inactive"}</td>
                    <td><strong>{m.role_name}</strong></td>
                    <td>
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
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          disabled={processingId === m.id || !m.active}
                          onClick={() => updateRole(m)}
                          className="btn-table btn-table-primary"
                        >
                          Update
                        </button>
                        <button
                          disabled={processingId === m.id}
                          onClick={() => toggleMember(m.id, m.active)}
                          className={
                            m.active
                              ? "btn-table btn-table-danger"
                              : "btn-table btn-table-success"
                          }
                        >
                          {m.active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Role Requests */}
      <div className="card">
        <h3>Pending Role Requests</h3>

        {loadingRequests ? (
          <div>Loading requests…</div>
        ) : roleRequests.length === 0 ? (
          <div>No pending requests</div>
        ) : (
          <ul>
            {roleRequests.map((r) => (
              <li key={r.id} className="table-actions">
                <span>
                  {r.requester?.full_name} → <b>{r.requested_role}</b>
                </span>
                <div className="table-actions">
                  <button
                    disabled={requestProcessingId === r.id}
                    onClick={() => approveRequest(r.id)}
                    className="btn-table btn-table-success"
                  >
                    Approve
                  </button>
                  <button
                    disabled={requestProcessingId === r.id}
                    onClick={() => rejectRequest(r.id)}
                    className="btn-table btn-table-danger"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
