// src/components/members/AddMember.jsx
import { useState, useMemo } from "react";
import { memberFields } from "../../utils/memberFields";
import { MembersAPI } from "../../utils/api"; // centralized API
import Button from "../Button";
import Input from "../Input";

export default function AddMember({ department, onMemberAdded }) {
  const config = memberFields[department];
  const fields = config?.fields ?? [];

  // Initialize form state
  const initialState = useMemo(
    () => Object.fromEntries(fields.map(f => [f.name, ""])),
    [fields]
  );

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!fields.length) return <p>No form configuration for "{department}"</p>;

  const handleChange = (e, name) => {
    setFormData(prev => ({ ...prev, [name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        setError(`${field.label} is required`);
        return;
      }
    }

    setLoading(true);
    try {
      const result = await MembersAPI.add(department, formData);
      if (!result) throw new Error("Failed to add member");

      setFormData(initialState);  // Reset form
      onMemberAdded?.();          // Notify parent
    } catch (err) {
      console.error("AddMember error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-member-form" onSubmit={handleSubmit}>
      <h2>Add Member – {department}</h2>

      {error && <p className="error-text">{error}</p>}

      {fields.map(f => (
        <div key={f.name} className="form-group">
          <label className="form-label">{f.label}</label>
          {f.type === "select" ? (
            <select
              name={f.name}
              value={formData[f.name] || ""}
              onChange={e => handleChange(e, f.name)}
              required={f.required}
            >
              <option value="">Select {f.label}</option>
              {f.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <Input
              type={f.type || "text"}
              name={f.name}
              value={formData[f.name] || ""}
              onChange={e => handleChange(e, f.name)}
              required={f.required}
            />
          )}
        </div>
      ))}

      <div className="form-actions">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Member"}
        </Button>
      </div>
    </form>
  );
}
