import { useState, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import { memberFields } from "../../utils/memberFields";

export default function AddMember({ department, onMemberAdded }) {
  const config = memberFields[department];
  const fields = config?.fields ?? [];
  const table = config?.table;

  const initialState = useMemo(() => Object.fromEntries(fields.map(f => [f.name, ""])), [fields]);
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e, name) => setFormData(prev => ({ ...prev, [name]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!table || !fields.length) return;

    setLoading(true);
    try {
      const { error } = await supabase.from(table).insert([formData]);
      if (error) throw error;
      setFormData(initialState);
      onMemberAdded?.();
    } catch (err) {
      console.error("AddMember error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!table || !fields.length) return <p>No form configuration for "{department}"</p>;

  return (
    <form onSubmit={handleAdd} style={{ maxWidth: 400 }}>
      <h2>Add Member to {department}</h2>
      {fields.map(f => (
        <div key={f.name} style={{ marginBottom: 12 }}>
          <label>{f.label}</label>
          <input
            type={f.type}
            value={formData[f.name] ?? ""}
            onChange={e => handleChange(e, f.name)}
            required={f.required}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
      ))}
      <button disabled={loading}>{loading ? "Saving..." : "Add Member"}</button>
    </form>
  );
}