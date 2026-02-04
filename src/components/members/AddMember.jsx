// src/components/members/AddMember.jsx
import { useState, useMemo } from "react";
import { memberFields } from "../../utils/memberFields";
import { MembersAPI } from "../../utils/api";

export default function AddMember({ department, onMemberAdded }) {
  const config = memberFields[department];
  const fields = config?.fields ?? [];

  const initialState = useMemo(
    () => Object.fromEntries(fields.map(f => [f.name, ""])),
    [fields]
  );

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!fields.length) {
    return (
      <div className="dashboard-content">
        <div className="card">No form configuration for "{department}"</div>
      </div>
    );
  }

  const handleChange = (e, name) => {
    setFormData(prev => ({ ...prev, [name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        setError(`${field.label} is required`);
        return;
      }
    }

    setLoading(true);
    try {
      const payload = { ...formData, department };
      const result = await MembersAPI.add(payload);

      if (!result?.member) {
        throw new Error("Failed to add member");
      }

      setFormData(initialState);
      onMemberAdded?.(result.member);
    } catch (err) {
      console.error("AddMember error:", err);
      setError(err.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content">
      <div className="card">
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
          Add Member – {department}
        </h2>

        {error && (
          <p style={{ color: "#dc2626", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map(f => (
            <div key={f.name} className="form-group">
              <label>{f.label}</label>

              {f.type === "select" ? (
                <select
                  value={formData[f.name] || ""}
                  onChange={e => handleChange(e, f.name)}
                  required={f.required}
                  style={{
                    padding: "0.55rem 0.75rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e0",
                  }}
                >
                  <option value="">Select {f.label}</option>
                  {f.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  value={formData[f.name] || ""}
                  onChange={e => handleChange(e, f.name)}
                  required={f.required}
                />
              )}
            </div>
          ))}

          <div style={{ marginTop: "1rem" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
