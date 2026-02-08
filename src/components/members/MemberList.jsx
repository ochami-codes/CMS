// src/components/members/MemberList.jsx
import { useEffect, useState, useCallback } from "react";
import { useToast } from "../ToastProvider";
import { MembersAPI } from "../../utils/api";
import { memberFields } from "../../utils/memberFields";
import { DEPARTMENT_LABELS } from "../../utils/departmentLabels";

export default function MemberList({ department, refreshKey }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const { showToast } = useToast(); // use global toast

  const config = memberFields[department];
  const fields = config?.fields ?? [];

  const departmentLabel =
    DEPARTMENT_LABELS[department] ?? department;

  // ---------------- FETCH MEMBERS ----------------
  const loadMembers = useCallback(async () => {
    if (!department) return;

    setLoading(true);
    try {
      const res = await MembersAPI.fetchAll(department);
      setMembers(Array.isArray(res?.members) ? res.members : []);
    } catch (err) {
      console.error("Load members error:", err);
      showToast(err.message || "Failed to fetch members", "error");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [department, showToast]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers, refreshKey]);

  // ---------------- DELETE MEMBER ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    setDeletingId(id);

    try {
      await MembersAPI.remove(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      showToast("Member deleted successfully", "success");
    } catch (err) {
      console.error("Delete member error:", err);
      showToast(err.message || "Failed to delete member", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------- UI STATES ----------------
  if (!department) {
    return (
      <div className="dashboard-content">
        <div className="card">No department selected.</div>
      </div>
    );
  }

  if (!fields.length) {
    return (
      <div className="dashboard-content">
        <div className="card">
          No member configuration for <strong>{departmentLabel}</strong>.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="card">Loading members…</div>
      </div>
    );
  }

  // ---------------- TABLE ----------------
  return (
    <div className="dashboard-content">
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">
          {departmentLabel} Members
        </h2>

        {members.length === 0 ? (
          <p className="text-gray-500">No members found.</p>
        ) : (
          <table className="member-list-table">
            <thead>
              <tr>
                {fields.map((f) => (
                  <th key={f.name}>{f.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  {fields.map((f) => (
                    <td key={f.name}>
                      {member[f.name] ?? "-"}
                    </td>
                  ))}

                  <td>
                    <button
                      onClick={() => handleDelete(member.id)}
                      disabled={deletingId === member.id}
                      className="btn-table btn-table-danger"
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
    </div>
  );
}
