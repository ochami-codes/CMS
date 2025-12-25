import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";
import { memberFields } from "../../utils/memberFields";

export default function MemberList({ department, refresh }) {
  const config = memberFields[department];
  const fields = config?.fields ?? [];
  const table = config?.table;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    if (!table) return;
    setLoading(true);

    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    if (!error && Array.isArray(data)) setMembers(data);
    else { setMembers([]); if (error) console.error(error.message); }

    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, [table, refresh]);

  const handleDelete = async (id) => {
    if (!table || !window.confirm("Are you sure?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (!error) setMembers(prev => prev.filter(m => m.id !== id));
  };

  if (!table || !fields.length) return <p>No configuration for "{department}"</p>;
  if (loading) return <p>Loading members...</p>;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#f1f1f1" }}>
          {fields.map(f => <th key={f.name} style={{ padding: 8 }}>{f.label}</th>)}
          <th style={{ padding: 8 }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {members.length ? members.map(m => (
          <tr key={m.id} style={{ borderBottom: "1px solid #eee" }}>
            {fields.map(f => <td key={f.name} style={{ padding: 8 }}>{m[f.name] ?? "-"}</td>)}
            <td style={{ padding: 8 }}>
              <button
                style={{ padding: "4px 10px", background: "#e63946", color: "#fff", border: "none", borderRadius: 4 }}
                onClick={() => handleDelete(m.id)}
              >Delete</button>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan={fields.length + 1} style={{ textAlign: "center", padding: 8 }}>No members found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}