// src/components/admin/ManageRoles.jsx
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
  const { profile, loading: authLoading } = useAuth();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [processingId, setProcessingId] = useState(null);

  /* ------------------ Fetch Members ------------------ */
  const fetchMembers = useCallback(async () => {
    if (!profile?.church_id) return;

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        search,
        department,
        page,
        pageSize,
      }).toString();

      const data = await AdminAPI.fetchMembers(params);

      if (!data || !Array.isArray(data.members)) {
        setMembers([]);
        setTotal(0);
        return;
      }

      setMembers(
        data.members.map((m) => ({
          ...m,
          selectedRole: m.role_name || "Member",
        }))
      );

      setTotal(data.total || 0);
    } catch (err) {
      console.error("Fetch members error:", err);
      setMembers([]);
      setTotal(0);
      setError(err.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  }, [profile, search, department, page, pageSize]);

  /* ------------------ Effects ------------------ */
  useEffect(() => {
    if (authLoading || !profile?.church_id) return;
    fetchMembers();
  }, [authLoading, profile, fetchMembers]);

  /* ------------------ Actions ------------------ */
  const requestRoleChange = async (member) => {
    if (member.selectedRole === member.role_name) return;

    setProcessingId(member.id);
    try {
      await AdminAPI.updateMemberRole(member.id, member.selectedRole);
      alert("Role change request submitted.");
      fetchMembers();
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

  /* ------------------ Render Guards ------------------ */
  if (authLoading) {
    return <div className="p-4">Checking admin permissions…</div>;
  }

  if (!profile) {
    return <div className="p-4">Loading admin profile…</div>;
  }

  if (loading) {
    return <div className="p-4">Loading members…</div>;
  }

  /* ------------------ UI ------------------ */
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Roles</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <input
          className="border px-2 py-1 rounded flex-1"
          placeholder="Search by name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <input
          className="border px-2 py-1 rounded flex-1"
          placeholder="Filter by department"
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Members Table */}
      <table className="w-full border">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Department</th>
            <th className="p-2 text-left">Current Role</th>
            <th className="p-2 text-left">New Role</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 && (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No members found
              </td>
            </tr>
          )}

          {members.map((member) => (
            <tr key={member.id} className="border-b">
              <td className="p-2">{member.full_name || "(No name)"}</td>
              <td className="p-2">{member.department || "-"}</td>
              <td className="p-2 font-semibold">{member.role_name}</td>

              <td className="p-2">
                <select
                  value={member.selectedRole}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((m) =>
                        m.id === member.id
                          ? { ...m, selectedRole: e.target.value }
                          : m
                      )
                    )
                  }
                  className="border px-2 py-1 rounded"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>

              <td className="p-2 flex gap-2">
                <button
                  disabled={
                    member.selectedRole === member.role_name ||
                    processingId === member.id
                  }
                  onClick={() => requestRoleChange(member)}
                  className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Request
                </button>

                <button
                  disabled={processingId === member.id}
                  onClick={() => deactivateMember(member.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
        </span>

        <button
          disabled={members.length < pageSize}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
