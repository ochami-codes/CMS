import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function MemberList({ department, refresh }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Import fields dynamically to render table headers
  const { memberFields } = require("../../utils/memberFields");
  const fields = memberFields[department] || [];

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(department) // Table name must match department
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setMembers(data);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, [department, refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    const { error } = await supabase.from(department).delete().eq("id", id);
    if (!error) setMembers(members.filter(m => m.id !== id));
  };

  if (loading) return <p>Loading members...</p>;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#f1f1f1" }}>
          {fields.map(f => (
            <th key={f.name} style={{ padding: "8px", textAlign: "left" }}>
              {f.label}
            </th>
          ))}
          <th style={{ padding: "8px", textAlign: "left" }}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {members.length ? (
          members.map(m => (
            <tr key={m.id} style={{ borderBottom: "1px solid #eee" }}>
              {fields.map(f => <td key={f.name} style={{ padding: "8px" }}>{m[f.name]}</td>)}
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => handleDelete(m.id)}
                  style={{
                    padding: "4px 10px",
                    background: "#e63946",
                    color: "#fff",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={fields.length + 1} style={{ padding: "8px", textAlign: "center" }}>
              No members found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}