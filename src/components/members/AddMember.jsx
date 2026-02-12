// src/components/members/AddMember.jsx
import { useState, useMemo, useEffect } from "react";
import { memberFields } from "../../utils/memberFields.js";
import { DepartmentsAPI, MembersAPI } from "../../utils/api";
import { useToast } from "../ToastProvider";
import "../../styles/pages.css";
export default function AddMember({ department, onMemberAdded }) {
  const config = memberFields[department];
  const fields = config?.fields ?? [];
  const { showToast } = useToast();

  const initialState = useMemo(
    () => Object.fromEntries(fields.map(f => [f.name, ""])),
    [fields]
  );

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [departmentsList, setDepartmentsList] = useState([]);

  /* ---------------- FETCH DEPARTMENTS ---------------- */
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await DepartmentsAPI.fetchAll();
        setDepartmentsList(res ?? []);
      } catch (err) {
        console.error(err);
        showToast("Failed to load departments", "error");
      }
    };
    loadDepartments();
  }, [showToast]);

  if (!fields.length) {
    return (
      <>
        <h2 className="card-title">Add Member</h2>
        <p className="card-subtitle">
          No form configuration for "{department}"
        </p>
      </>
    );
  }

  /* ---------------- CHANGE ---------------- */
  const handleChange = (e, name) => {
    setFormData(prev => ({ ...prev, [name]: e.target.value }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        showToast(`${field.label} is required`, "error");
        return;
      }
    }

    setLoading(true);
    try {
      const payload = { ...formData, department };
      const result = await MembersAPI.add(payload);

      if (!result?.member) throw new Error("Failed to add member");

      setFormData(initialState);
      showToast("Member added successfully", "success");
      onMemberAdded?.(result.member);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to add member", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <>
      <h2 className="card-title">
        Add Member
        <span className="card-title-muted"> – {department}</span>
      </h2>

      <p className="card-subtitle">
        Fill in the details below to register a new member.
      </p>

      <form onSubmit={handleSubmit} className="form-stack">
        {fields.map(f => (
          <div key={f.name} className="form-group">
            <label className="label">{f.label}</label>

            {f.type === "select" ? (
              <select
                value={formData[f.name] || ""}
                onChange={e => handleChange(e, f.name)}
                required={f.required}
                className="input-field"
              >
                <option value="">
                  {f.name === "department"
                    ? "Select Department"
                    : `Select ${f.label}`}
                </option>

                {f.name === "department"
                  ? departmentsList.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))
                  : f.options?.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
              </select>
            ) : (
              <input
                type={f.type || "text"}
                value={formData[f.name] || ""}
                onChange={e => handleChange(e, f.name)}
                required={f.required}
                className="input-field"
              />
            )}
          </div>
        ))}

        <div className="mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Saving…" : "Add Member"}
          </button>
        </div>
      </form>
    </>
  );
}
