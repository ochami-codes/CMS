import { useEffect, useState, useCallback } from "react";
import { AdminAPI, AdminMembershipAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { Check, X, RefreshCw, UserPlus } from "lucide-react";

const ROLES = [
  "Admin",
  "Pastor",
  "Treasurer",
  "Children_leader",
  "Youth_leader",
  "Communication_leader",
  "Member",
];

export default function AdminMembers() {
  const { profile, setProfile, setUser, loading: authLoading } = useAuth();

  /* ------------------ State ------------------ */
  const [members, setMembers] = useState([]);
  const [nonMembers, setNonMembers] = useState([]);
  const [roleRequests, setRoleRequests] = useState([]);
  const [membershipRequests, setMembershipRequests] = useState([]);

  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingNonMembers, setLoadingNonMembers] = useState(true);
  const [loadingRoleRequests, setLoadingRoleRequests] = useState(true);
  const [loadingMembershipRequests, setLoadingMembershipRequests] = useState(true);

  const [processingId, setProcessingId] = useState(null);
  const [requestProcessingId, setRequestProcessingId] = useState(null);

  const [search, setSearch] = useState("");

  /* ------------------ Fetch Functions ------------------ */
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

  const fetchNonMembers = useCallback(async () => {
    if (!profile?.church_id) return;
    setLoadingNonMembers(true);
    try {
      const data = await AdminAPI.fetchNonMembers();
      setNonMembers(data.non_members ?? []);
    } finally {
      setLoadingNonMembers(false);
    }
  }, [profile]);

  const fetchRoleRequests = useCallback(async () => {
    if (!profile?.church_id) return;
    setLoadingRoleRequests(true);
    try {
      const data = await AdminAPI.fetchRoleRequests();
      setRoleRequests(data.requests ?? []);
    } finally {
      setLoadingRoleRequests(false);
    }
  }, [profile]);

  const fetchMembershipRequests = useCallback(async () => {
    if (!profile?.church_id) return;
    setLoadingMembershipRequests(true);
    try {
      const data = await AdminMembershipAPI.fetchAll();
      setMembershipRequests(data.requests ?? []);
    } finally {
      setLoadingMembershipRequests(false);
    }
  }, [profile]);

  /* ------------------ Effects ------------------ */
  useEffect(() => {
    if (!authLoading && profile?.church_id) {
      fetchMembers();
      fetchNonMembers();
      fetchRoleRequests();
      fetchMembershipRequests();
    }
  }, [
    authLoading,
    profile,
    fetchMembers,
    fetchNonMembers,
    fetchRoleRequests,
    fetchMembershipRequests,
  ]);

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

      if (member.id === profile.id) {
        setProfile((p) => ({ ...p, role_name: member.selectedRole }));
        setUser((u) => ({ ...u, role_name: member.selectedRole }));
      }
    } finally {
      setProcessingId(null);
    }
  };

  const toggleMember = async (id, active) => {
    if (!confirm(active ? "Deactivate this member?" : "Activate this member?")) return;
    setProcessingId(id);
    try {
      active
        ? await AdminAPI.deactivateMember(id)
        : await AdminAPI.activateMember(id);
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, active: !active } : m))
      );
    } finally {
      setProcessingId(null);
    }
  };

  /* ------------------ Role Requests ------------------ */
  const approveRole = async (id) => {
    setRequestProcessingId(id);
    await AdminAPI.approveRoleRequest(id);
    await fetchMembers();
    await fetchRoleRequests();
    setRequestProcessingId(null);
  };

  const rejectRole = async (id) => {
    setRequestProcessingId(id);
    await AdminAPI.rejectRoleRequest(id);
    await fetchRoleRequests();
    setRequestProcessingId(null);
  };

  /* ------------------ Membership Requests ------------------ */
  const approveMembership = async (id) => {
    setRequestProcessingId(id);
    await AdminMembershipAPI.approve(id);
    await fetchNonMembers();
    await fetchMembershipRequests();
    setRequestProcessingId(null);
  };

  const rejectMembership = async (id) => {
    setRequestProcessingId(id);
    await AdminMembershipAPI.reject(id);
    await fetchMembershipRequests();
    setRequestProcessingId(null);
  };

  /* ------------------ Invite Non-Member ------------------ */
  const inviteNonMember = async (id) => {
    if (!confirm("Send membership request to this profile?")) return;
    setProcessingId(id);
    try {
      await AdminAPI.sendInvite(id);
      await fetchNonMembers();
      await fetchMembershipRequests();
    } finally {
      setProcessingId(null);
    }
  };

  if (authLoading) return <div>Checking permissions…</div>;
  if (!profile) return <div>Loading profile…</div>;

  return (
    <div className="dashboard-content">
      <h2>Admin Members & Roles</h2>
      <input
        placeholder="Search members…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      {/* ------------------ Members Table ------------------ */}
      <div className="card">
        <h3>Manage Members</h3>
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
                    <td>{m.role_name}</td>
                    <td>
                      <select
                        value={m.selectedRole}
                        disabled={!m.active}
                        onChange={(e) =>
                          setMembers((prev) =>
                            prev.map((x) =>
                              x.id === m.id ? { ...x, selectedRole: e.target.value } : x
                            )
                          )
                        }
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        disabled={processingId === m.id || !m.active}
                        onClick={() => updateRole(m)}
                        title="Update Role"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        disabled={processingId === m.id}
                        onClick={() => toggleMember(m.id, m.active)}
                        title={m.active ? "Deactivate" : "Activate"}
                      >
                        {m.active ? <X size={16} /> : <Check size={16} />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ------------------ Non-Members ------------------ */}
      <div className="card">
        <h3>Profiles Not Yet Members</h3>
        {loadingNonMembers ? (
          <div>Loading…</div>
        ) : nonMembers.length === 0 ? (
          <div>No profiles found</div>
        ) : (
          <ul>
            {nonMembers.map((p) => (
              <li key={p.id}>
                {p.full_name} ({p.email})
                <button
                  onClick={() => inviteNonMember(p.id)}
                  disabled={processingId === p.id}
                  title="Send Membership Invite"
                >
                  <UserPlus size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ------------------ Role Requests ------------------ */}
      <div className="card">
        <h3>Pending Role Requests</h3>
        {loadingRoleRequests ? (
          <div>Loading…</div>
        ) : roleRequests.length === 0 ? (
          <div>No pending requests</div>
        ) : (
          <ul>
            {roleRequests.map((r) => (
              <li key={r.id}>
                {r.requester?.full_name} → <b>{r.requested_role}</b>
                <button
                  disabled={requestProcessingId === r.id}
                  onClick={() => approveRole(r.id)}
                  title="Approve"
                >
                  <Check size={16} />
                </button>
                <button
                  disabled={requestProcessingId === r.id}
                  onClick={() => rejectRole(r.id)}
                  title="Reject"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ------------------ Membership Requests ------------------ */}
      <div className="card">
        <h3>Pending Membership Requests</h3>
        {loadingMembershipRequests ? (
          <div>Loading…</div>
        ) : membershipRequests.length === 0 ? (
          <div>No pending requests</div>
        ) : (
          <ul>
            {membershipRequests.map((r) => (
              <li key={r.id}>
                {r.requester?.full_name} ({r.membership_requested_at})
                <button
                  disabled={requestProcessingId === r.id}
                  onClick={() => approveMembership(r.id)}
                  title="Approve"
                >
                  <Check size={16} />
                </button>
                <button
                  disabled={requestProcessingId === r.id}
                  onClick={() => rejectMembership(r.id)}
                  title="Reject"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
