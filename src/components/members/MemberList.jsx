// src/components/members/MemberList.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MembersAPI } from "../../utils/api";
import { memberFields } from "../../utils/memberFields";

export default function MemberList({ department, refreshKey }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const config = memberFields[department];
  const fields = config?.fields ?? [];

  // ------------------ FETCH MEMBERS ------------------
  const loadMembers = async () => {
    if (!department) return;

    setLoading(true);
    try {
      const data = await MembersAPI.fetchAll(department);
      setMembers(data.members || []); // Ensure members array
    } catch (err) {
      console.error("Load members error:", err);
      toast.error(err.message || "Failed to fetch members");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [department, refreshKey]);

  // ------------------ DELETE MEMBER ------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    setDeletingId(id);
    const toastId = toast.loading("Deleting member...");

    try {
      await MembersAPI.remove(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success("Member deleted successfully", { id: toastId });
    } catch (err) {
      console.error("Delete member error:", err);
      toast.error(err.message || "Failed to delete member", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  // ------------------ UI STATES ------------------
  if (!department) return <p>No department selected</p>;
  if (!fields.length) return <p>No form configuration for "{department}"</p>;
  if (loading) return <p>Loading members…</p>;
  if (!members.length) return <p>No members found</p>;

  // ------------------ TABLE ------------------
  return (
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
              <td key={f.name}>{member[f.name] ?? "-"}</td>
            ))}

            <td>
              <button
                onClick={() => handleDelete(member.id)}
                disabled={deletingId === member.id}
                className="delete-btn"
              >
                {deletingId === member.id ? "Deleting…" : "Delete"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
