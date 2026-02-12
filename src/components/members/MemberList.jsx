// src/components/members/MemberList.jsx
import { useEffect, useState, useCallback } from "react";
import { useToast } from "../ToastProvider";
import { MembersAPI } from "../../utils/api";
import { memberFields } from "../../utils/memberFields";
import "../../styles/pages.css";
export default function MemberList({ department, refreshKey, currentUser }) {
  const { showToast } = useToast();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  /* ---------------- CONFIG ---------------- */
  const config = memberFields[department];

  if (!department) {
    return (
      <div className="card">
        <h2 className="card-title">Members</h2>
        <p className="card-subtitle">No department selected.</p>
      </div>
    );
  }

  if (!config || !Array.isArray(config.fields)) {
    console.error("Invalid memberFields config:", department, config);
    return (
      <div className="card">
        <h2 className="card-title">Members</h2>
        <p className="card-subtitle">Invalid member configuration.</p>
      </div>
    );
  }

  const { fields } = config;

  /* ---------------- FETCH MEMBERS ---------------- */
  const loadMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await MembersAPI.fetchAll(department);
      setMembers(Array.isArray(res?.members) ? res.members : []);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to fetch members", "error");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [department, showToast]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers, refreshKey]);

  /* ---------------- ACTIONS ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    setDeletingId(id);
    try {
      await MembersAPI.remove(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      showToast("Member deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to delete member", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    if (!["Admin", "Clerk"].includes(currentUser?.role)) return;
    window.location.href = `/members/${department}/edit/${id}`;
  };

  /* ---------------- STATES ---------------- */
  if (loading) {
    return (
      <div className="card">
        <p>Loading members…</p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="card">
      <h2 className="card-title">
        {members[0]?.department_name ?? department} Members
      </h2>

      <p className="card-subtitle">
        Registered members in this department.
      </p>

      {members.length === 0 ? (
        <p className="table-empty">No members found.</p>
      ) : (
        <table className="member-list-table">
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field.name}>{field.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                {fields.map((field) => (
                  <td key={field.name}>
                    {member[field.name] ?? "-"}
                  </td>
                ))}

                <td className="table-actions">
                  {["Admin", "Clerk"].includes(currentUser?.role) && (
                    <button
                      onClick={() => handleEdit(member.id)}
                      className="btn btn-secondary btn-sm"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(member.id)}
                    disabled={deletingId === member.id}
                    className="btn btn-danger btn-sm"
                  >
                    {deletingId === member.id ? "Deleting…" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
