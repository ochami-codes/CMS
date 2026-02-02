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
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedDepartment, setDebouncedDepartment] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [processingId, setProcessingId] = useState(null);
  const [requestProcessingId, setRequestProcessingId] = useState(null);

  /* ------------------ Debounce Filters ------------------ */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setDebouncedDepartment(department);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, department]);

  /* ------------------ Fetch Members ------------------ */
  const fetchMembers = useCallback(async () => {
    if (!profile?.church_id) return;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        search: debouncedSearch,
        department: debouncedDepartment,
        page,
        pageSize,
      }).toString();

      const data = await AdminAPI.fetchMembers(params);

      if (!data?.members) {
        setMembers([]);
        return;
      }

      setMembers(
        data.members.map((m) => ({
          ...m,
          selectedRole: m.role_name || "Member",
        }))
      );
    } catch (err) {
      console.error(err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [profile, debouncedSearch, debouncedDepartment, page, pageSize]);

  /* ------------------ Fetch Role Requests ------------------ */
  const fetchRoleRequests = useCallback(async () => {
    if (!profile?.church_id) return;
    setRequestsLoading(true);
    try {
      const data = await AdminAPI.fetchRoleRequests();
      setRoleRequests(data.requests ?? []);
    } catch {
      setRoleRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (!authLoading && profile?.church_id) {
      fetchMembers();
      fetchRoleRequests();
    }
  }, [authLoading, profile, fetchMembers, fetchRoleRequests]);

  /* ------------------ Actions ------------------ */
  const requestRoleChange = async (member) => {
    if (member.selectedRole === member.role_name) return;
    setProcessingId(member.id);
    try {
      const updatedMember = await AdminAPI.updateMemberRole(member.id, member.selectedRole);

      // Update local members list
      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id ? { ...m, role_name: member.selectedRole } : m
        )
      );

      // If the updated member is the logged-in user, update profile
      if (member.id === profile.id) {
        setProfile((prev) => ({ ...prev, role_name: member.selectedRole }));
        setUser((prev) => ({ ...prev, role_name: member.selectedRole }));
      }

      alert("Role updated successfully!");
    } catch (err) {
      alert(err.message || "Not allowed");
    } finally {
      setProcessingId(null);
    }
  };

  const deactivateMember = async (id) => {
    if (!confirm("Deactivate this member?")) return;
    setProcessingId(id);
    try {
      await AdminAPI.deactivateMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      alert("Member deactivated successfully");
    } catch (err) {
      alert(err.message || "Failed to deactivate member");
    } finally {
      setProcessingId(null);
    }
  };

  const approveRequest = async (id) => {
    setRequestProcessingId(id);
    try {
      await AdminAPI.approveRoleRequest(id);
      fetchMembers();
      fetchRoleRequests();
    } finally {
      setRequestProcessingId(null);
    }
  };

  const rejectRequest = async (id) => {
    setRequestProcessingId(id);
    try {
      await AdminAPI.rejectRoleRequest(id);
      fetchRoleRequests();
    } finally {
      setRequestProcessingId(null);
    }
  };

  if (authLoading) return <div>Checking permissions…</div>;
  if (!profile) return <div>Loading profile…</div>;

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Manage Roles & Requests</h2>

      {/* Filters */}
      <div className="flex gap-3 mb-3">
        <input
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <input
          placeholder="Filter by department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
      </div>

      {/* Members Table */}
      <div className="card overflow-x-auto">
        {loading ? (
          <div className="p-4">Loading members…</div>
        ) : (
          <table className="table-auto w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Current Role</th>
                <th>New Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No members found
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id}>
                    <td>{m.full_name}</td>
                    <td>{m.department || "-"}</td>
                    <td className="font-semibold">{m.role_name}</td>
                    <td>
                      <select
                        value={m.selectedRole}
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
                        disabled={processingId === m.id}
                        onClick={() => requestRoleChange(m)}
                        className="btn-table btn-table-primary"
                      >
                        Update
                      </button>
                      <button
                        disabled={processingId === m.id}
                        onClick={() => deactivateMember(m.id)}
                        className="btn-table btn-table-danger"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pending Requests */}
      <div className="card p-4">
        <h3 className="font-bold mb-3">Pending Role Requests</h3>
        {requestsLoading ? (
          <div>Loading requests…</div>
        ) : roleRequests.length === 0 ? (
          <div>No pending requests</div>
        ) : (
          <ul className="space-y-2">
            {roleRequests.map((r) => (
              <li key={r.id} className="flex justify-between border-b p-2 rounded">
                <span>
                  {r.requester?.full_name} → <b>{r.requested_role}</b>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveRequest(r.id)}
                    disabled={requestProcessingId === r.id}
                    className="btn-table btn-table-success"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectRequest(r.id)}
                    disabled={requestProcessingId === r.id}
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
