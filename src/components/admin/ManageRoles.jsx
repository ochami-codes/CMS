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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const [processingId, setProcessingId] = useState(null);

  const pageSize = 10;

  /* ======================
     FETCH USERS
  ====================== */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        department,
        page,
        pageSize,
      }).toString();

      const data = await AdminAPI.fetchUsers(params);

      setUsers(
        data.users.map((u) => ({
          ...u,
          selectedRole: u.role, // keep DB role exactly
        }))
      );
    } catch (err) {
      alert(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, department, page]);

  /* ======================
     REQUEST ROLE CHANGE
  ====================== */
  const requestRoleChange = async (user) => {
    if (user.selectedRole === user.role) return;

    setProcessingId(user.id);
    try {
      await AdminAPI.requestRoleChange({
        targetUserId: user.id,
        requestedRole: user.selectedRole,
      });

      alert("Role change request submitted.");
    } catch (err) {
      alert(err.message || "Not allowed");
    } finally {
      setProcessingId(null);
    }
  };

  /* ======================
     DEACTIVATE USER
  ====================== */
  const deactivateUser = async (id) => {
    if (!confirm("Deactivate this member?")) return;

    setProcessingId(id);
    try {
      await AdminAPI.deactivateUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.message || "Failed to deactivate user");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="p-4">Loading members...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Roles</h2>

      {/* Search & Filter */}
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

      {/* Users Table */}
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
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.full_name || "(No name)"}</td>
              <td className="p-2">{user.department || "-"}</td>
              <td className="p-2 font-semibold">{user.role}</td>

              <td className="p-2">
                <select
                  value={user.selectedRole}
                  onChange={(e) =>
                    setUsers((prev) =>
                      prev.map((u) =>
                        u.id === user.id
                          ? { ...u, selectedRole: e.target.value }
                          : u
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
                    user.selectedRole === user.role ||
                    processingId === user.id
                  }
                  onClick={() => requestRoleChange(user)}
                  className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Request
                </button>

                <button
                  disabled={processingId === user.id}
                  onClick={() => deactivateUser(user.id)}
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

        <span>Page {page}</span>

        <button
          disabled={users.length < pageSize}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
