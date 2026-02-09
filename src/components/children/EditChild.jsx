// src/components/members/EditChild.jsx
import { useState, useEffect } from "react";
import { memberFields } from "../../utils/memberFields";
import { ChildrenAPI, DepartmentsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ToastProvider";

export default function EditChild({ child, onUpdated, onCancel }) {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const { fields } = memberFields["children"]; // always children

  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // ------------------ LOAD DEPARTMENTS ------------------
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await DepartmentsAPI.fetchAll();
        setDepartments(res ?? []);
      } catch (err) {
        console.error("Failed to load departments:", err);
        showToast("Failed to load departments", "error");
      }
    };
    loadDepartments();
  }, [showToast]);

  // ------------------ INITIALIZE FORM ------------------
  useEffect(() => {
    const data = {};
    fields.forEach((f) => {
      if (f.name === "department") {
        f.options = departments.map((d) => d.name);
      }
      data[f.name] = child[f.name] ?? "";
    });
    setFormData(data);
  }, [child, fields, departments]);

  // ------------------ HANDLE CHANGE ------------------
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ------------------ HANDLE SUBMIT ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        showToast(`${field.label} is required`, "error");
        return;
      }
    }

    const payload = { ...formData, church_id: profile?.church_id };
    if (payload.date_of_birth) {
      payload.date_of_birth = new Date(payload.date_of_birth).toISOString();
    }

    setLoading(true);
    try {
      const result = await ChildrenAPI.update(child.id, payload);
      if (!result) throw new Error("Failed to update child");

      showToast("Child updated successfully", "success");
      onUpdated?.();
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error updating child", "error");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ RENDER ------------------
  return (
    <div className="dashboard-content">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Edit Child</h3>

        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} className="form-group">
              <label>{field.label}</label>

              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className="input"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className="input"
                />
              )}
            </div>
          ))}

          <div className="mt-4 flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
