// src/components/admin/ManageRoles.jsx
import { useEffect, useState } from "react";
import { AdminAPI } from "../../utils/api";

const roles = [
  "Admin",
  "Pastor",
  "Treasurer",
  "Children_leader",
  "Youth_leader",
  "Communication_leader",
  "Member",
];

export default function ManageRoles() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [processingId, setProcessingId] = useState(null);

  // Fetch members from backend
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        department,
        page,
        pageSize,
      }).toString();

      const data = await AdminAPI.fetchMembers(params); // now aligned with backend
      setMembers(
        (data.members || []).map((m) => ({
          ...m,
          selectedRole: m.role_name || "Member",
        }))
      );
      setTotal(data.total || 0);
    } catch (err) {
      alert(err.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [search, department, page]);

  // Request role change
  const requestRoleChange = async (member) => {
    if (member.selectedRole === member.role_name) return;

    setProcessingId(member.id);
    try {
      await AdminAPI.updateMemberRole(member.id, member.selectedRole);
      alert("Role change request submitted.");
      fetchMembers(); // refresh after change
    } catch (err) {
      alert(err.message || "Not allowed");
    } finally {
      setProcessingId(null);
    }
  };

  // Deactivate member
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

  if (loading) return <div className="p-4">Loading members…</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Roles</h2>

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
                  {roles.map((role) => (
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
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {Math.ceil(total / pageSize) || 1}
        </span>

        <button
          disabled={members.length < pageSize}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
