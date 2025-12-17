// src/components/admin/ManageRoles.jsx
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function ManageRoles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchUsers = async () => {
    let query = supabase
      .from("profiles")
      .select("id, full_name, role, department")
      .order("full_name", { ascending: true });

    if (search) query = query.ilike("full_name", `%${search}%`);
    if (departmentFilter) query = query.eq("department", departmentFilter);

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error } = await query;

    if (error) console.error("Error fetching users:", error);
    else setUsers(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [search, departmentFilter, page]);

  const updateRole = async (id, newRole) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", id);

    if (error) console.error("Error updating role:", error);
    else {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    }
  };

  const roles = [
    "admin",
    "pastor",
    "elder",
    "treasurer",
    "children_leader",
    "youth_leader",
    "communication_leader",
    "member",
  ];

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Role Management</h2>

      {/* Search & Filter */}
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded flex-1"
        />
        <input
          type="text"
          placeholder="Filter by department"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="border px-2 py-1 rounded flex-1"
        />
      </div>

      {/* Users Table */}
      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Department</th>
            <th className="p-2 text-left">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.full_name || "(No Name)"}</td>
              <td className="p-2">{user.department || "-"}</td>
              <td className="p-2">
                <select
                  value={user.role}
                  onChange={(e) => updateRole(user.id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
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