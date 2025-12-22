import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { memberFields } from "../../utils/memberFields";

export default function AddMember({ department, onMemberAdded }) {
  const fields = memberFields[department] || [];

  // Initialize form state with all fields empty
  const initialState = Object.fromEntries(fields.map(f => [f.name, ""]));
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e, fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: e.target.value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tableName = department; // Supabase table must match department
      const { error } = await supabase.from(tableName).insert([formData]);

      if (error) throw error;

      setFormData(initialState); // reset form
      if (onMemberAdded) onMemberAdded(); // notify parent to refresh list
    } catch (err) {
      console.error("Failed to add member:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdd} style={{ maxWidth: "400px" }}>
      <h2>Add Member to {department}</h2>

      {fields.map(f => (
        <div key={f.name} style={{ marginBottom: "1rem" }}>
          <label>{f.label}</label>
          <input
            type={f.type}
            value={formData[f.name]}
            onChange={(e) => handleChange(e, f.name)}
            required={f.required}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
      ))}

      <button disabled={loading}>
        {loading ? "Saving..." : "Add Member"}
      </button>
    </form>
  );
}