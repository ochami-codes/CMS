import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { memberFields } from "../../utils/memberFields";
import toast from "react-hot-toast";
import "../../styles/global.css";

export default function MemberList({ department, refresh }) {
  const config = memberFields[department];
  const fields = config?.fields ?? [];
  const table = config?.table;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMembers = async () => {
    if (!table) return;
    setLoading(true);

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) setMembers(data);
    else {
      setMembers([]);
      if (error) console.error(error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, [table, refresh]);

  const handleDelete = async id => {
    if (!table) return;
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    setDeletingId(id);
    const toastId = toast.loading("Deleting member...");
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;

      setMembers(prev => prev.filter(m => m.id !== id));
      toast.success("Member deleted successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to delete member: " + err.message, { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  if (!table || !fields.length) return <p>No configuration for "{department}"</p>;
  if (loading) return <p>Loading members...</p>;

  return (
    <table className="member-list-table">
      <thead>
        <tr>
          {fields.map(f => (
            <th key={f.name}>{f.label}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {members.length ? (
          members.map(m => (
            <tr key={m.id}>
              {fields.map(f => (
                <td key={f.name}>{m[f.name] ?? "-"}</td>
              ))}
              <td>
                <button
                  onClick={() => handleDelete(m.id)}
                  disabled={deletingId === m.id}
                  className="delete-btn"
                >
                  {deletingId === m.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={fields.length + 1} className="no-members">
              No members found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}