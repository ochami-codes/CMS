// src/components/members/AddMember.jsx
import { useState, useMemo } from "react";
import { memberFields } from "../../utils/memberFields";
import toast from "react-hot-toast";
import "../../styles/global.css";
import { API_BASE_URL } from "../../config/api";

export default function AddMember({ department, onMemberAdded }) {
  const config = memberFields[department];
  const fields = config?.fields ?? [];

  const initialState = useMemo(
    () => Object.fromEntries(fields.map(f => [f.name, ""])),
    [fields]
  );

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  if (!fields.length) {
    return <p>No form configuration for "{department}"</p>;
  }

  const handleChange = (e, name) => {
    setFormData(prev => ({ ...prev, [name]: e.target.value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Adding member...");

    try {
      const res = await fetch(`${API_BASE_URL}/members`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department,
          data: formData
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to add member");
      }

      setFormData(initialState);
      onMemberAdded?.();

      toast.success("Member added successfully", { id: toastId });
    } catch (err) {
      console.error("AddMember error:", err);
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdd} className="add-member-form">
      <h2 className="form-title">
        Add Member – {department.replace("_", " ")}
      </h2>

      {fields.map(f => (
        <div key={f.name} className="form-group">
          <label className="form-label">{f.label}</label>
          <input
            type={f.type || "text"}
            value={formData[f.name] || ""}
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