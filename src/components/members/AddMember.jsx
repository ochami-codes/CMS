// src/components/members/AddMember.jsx
import { useState, useMemo, useEffect } from "react";
import { memberFields } from "../../utils/memberFields.js";
import { DepartmentsAPI, MembersAPI } from "../../utils/api";
import { useToast } from "../ToastProvider";

export default function AddMember({ department, onMemberAdded }) {
  const config = memberFields[department];
  const fields = config?.fields ?? [];

  const initialState = useMemo(
    () => Object.fromEntries(fields.map(f => [f.name, ""])),
    [fields]
  );

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [departmentsList, setDepartmentsList] = useState([]);

  const { showToast } = useToast(); // use global toast

  // ---------------- FETCH DEPARTMENTS ----------------
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await DepartmentsAPI.fetchAll();
        setDepartmentsList(res ?? []);
      } catch (err) {
        console.error("Load departments error:", err);
        showToast("Failed to load departments", "error");
      }
    };
    loadDepartments();
  }, [showToast]);

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

    // Validate required fields
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
      console.error("AddMember error:", err);
      showToast(err.message || "Failed to add member", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">
          Add Member – {department}
        </h2>

        <form onSubmit={handleSubmit}>
          {fields.map(f => (
            <div key={f.name} className="form-group">
              <label>{f.label}</label>

              {f.type === "select" ? (
                <select
                  value={formData[f.name] || ""}
                  onChange={e => handleChange(e, f.name)}
                  required={f.required}
                  className="input"
                >
                  <option value="">
                    {f.name === "department" ? "Select Department" : `Select ${f.label}`}
                  </option>
                  {f.name === "department"
                    ? departmentsList.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))
                    : f.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))
                  }
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  value={formData[f.name] || ""}
                  onChange={e => handleChange(e, f.name)}
                  required={f.required}
                  className="input"
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
              {loading ? "Saving..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
