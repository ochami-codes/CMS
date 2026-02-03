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

  /* --------------------------------------------------
     Fetch members
  -------------------------------------------------- */
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
    } catch (err) {
      console.error("Fetch members error:", err);
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  }, [profile, search]);

  /* --------------------------------------------------
     Fetch role requests
  -------------------------------------------------- */
  const fetchRoleRequests = useCallback(async () => {
    if (!profile?.church_id) return;

    setLoadingRequests(true);
    try {
      const data = await AdminAPI.fetchRoleRequests();
      setRoleRequests(data.requests ?? []);
    } catch (err) {
      console.error("Fetch role requests error:", err);
      setRoleRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  }, [profile]);

  /* --------------------------------------------------
     Init
  -------------------------------------------------- */
  useEffect(() => {
    if (!authLoading && profile?.church_id) {
      fetchMembers();
      fetchRoleRequests();
    }
  }, [authLoading, profile, fetchMembers, fetchRoleRequests]);

  /* --------------------------------------------------
     Role update
  -------------------------------------------------- */
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

      // If admin updated themselves
      if (member.id === profile.id) {
        setProfile((p) => ({ ...p, role_name: member.selectedRole }));
        setUser((u) => ({ ...u, role_name: member.selectedRole }));
      }

      alert("Role updated successfully");
    } catch (err) {
      alert(err.message || "Failed to update role");
    } finally {
      setProcessingId(null);
    }
  };

  /* --------------------------------------------------
     Deactivate / Activate
  -------------------------------------------------- */
  const deactivateMember = async (id) => {
    if (!confirm("Deactivate this member?")) return;

    setProcessingId(id);
    try {
      await AdminAPI.deactivateMember(id);
      setMembers((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, active: false } : m
        )
      );
    } catch (err) {
      alert(err.message || "Failed to deactivate member");
    } finally {
      setProcessingId(null);
    }
  };

  const activateMember = async (id) => {
    if (!confirm("Activate this member?")) return;

    setProcessingId(id);
    try {
      await AdminAPI.activateMember(id);
      setMembers((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, active: true } : m
        )
      );
    } catch (err) {
      alert(err.message || "Failed to activate member");
    } finally {
      setProcessingId(null);
    }
  };

  /* --------------------------------------------------
     Role request actions
  -------------------------------------------------- */
  const approveRequest = async (id) => {
    setRequestProcessingId(id);
    try {
      await AdminAPI.approveRoleRequest(id);
      await fetchMembers();
      await fetchRoleRequests();
    } finally {
      setRequestProcessingId(null);
    }
  };

  const rejectRequest = async (id) => {
    setRequestProcessingId(id);
    try {
      await AdminAPI.rejectRoleRequest(id);
      await fetchRoleRequests();
    } finally {
      setRequestProcessingId(null);
    }
  };

  if (authLoading) return <div>Checking permissions…</div>;
  if (!profile) return <div>Loading profile…</div>;

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Manage Members & Roles</h2>

      {/* Search */}
      <input
        placeholder="Search members…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />

      {/* Members table */}
      <div className="card overflow-x-auto">
        {loadingMembers ? (
          <div className="p-4">Loading members…</div>
        ) : (
          <table className="table-auto w-full">
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
                  <td colSpan="6" className="p-4 text-center">
                    No members found
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr
                    key={m.id}
                    className={!m.active ? "opacity-60 italic" : ""}
                  >
                    <td>{m.full_name}</td>
                    <td>{m.department || "-"}</td>
                    <td>{m.active ? "Active" : "Inactive"}</td>
                    <td className="font-semibold">{m.role_name}</td>
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
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="flex gap-2">
                      <button
                        disabled={
                          processingId === m.id || !m.active
                        }
                        onClick={() => updateRole(m)}
                        className="btn-table btn-table-primary"
                      >
                        Update
                      </button>

                      {m.active ? (
                        <button
                          disabled={processingId === m.id}
                          onClick={() => deactivateMember(m.id)}
                          className="btn-table btn-table-danger"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          disabled={processingId === m.id}
                          onClick={() => activateMember(m.id)}
                          className="btn-table btn-table-success"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Role Requests */}
      <div className="card p-4">
        <h3 className="font-bold mb-3">Pending Role Requests</h3>

        {loadingRequests ? (
          <div>Loading requests…</div>
        ) : roleRequests.length === 0 ? (
          <div>No pending requests</div>
        ) : (
          <ul className="space-y-2">
            {roleRequests.map((r) => (
              <li
                key={r.id}
                className="flex justify-between items-center border-b p-2"
              >
                <span>
                  {r.requester?.full_name} →{" "}
                  <b>{r.requested_role}</b>
                </span>
                <div className="flex gap-2">
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
