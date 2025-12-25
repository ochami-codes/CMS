import { useState, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import { memberFields } from "../../utils/memberFields";
import toast from "react-hot-toast";
import "../../styles/global.css";

export default function AddMember({ department, onMemberAdded }) {
  const config = memberFields[department];
  const fields = config?.fields ?? [];
  const table = config?.table;

  const initialState = useMemo(
    () => Object.fromEntries(fields.map(f => [f.name, ""])),
    [fields]
  );
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e, name) =>
    setFormData(prev => ({ ...prev, [name]: e.target.value }));

  const handleAdd = async e => {
    e.preventDefault();
    if (!table || !fields.length) return;

    const toastId = toast.loading("Adding member...");
    setLoading(true);
    try {
      const { error } = await supabase.from(table).insert([formData]);
      if (error) throw error;

      setFormData(initialState);
      onMemberAdded?.();
      toast.success("Member added successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to add member: " + err.message, { id: toastId });
      console.error("AddMember error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!table || !fields.length)
    return <p>No form configuration for "{department}"</p>;

  return (
    <form onSubmit={handleAdd} className="add-member-form">
      <h2 className="form-title">Add Member to {department}</h2>

      {fields.map(f => (
        <div key={f.name} className="form-group">
          <label className="form-label">{f.label}</label>
          <input
            type={f.type}
            value={formData[f.name] ?? ""}
            onChange={e => handleChange(e, f.name)}
            required={f.required}
            className="form-input"
          />
        </div>
      ))}

      <button type="submit" disabled={loading} className="form-submit">
        {loading ? "Saving..." : "Add Member"}
      </button>
    </form>
  );
}