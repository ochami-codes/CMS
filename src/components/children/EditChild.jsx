import { useState, useEffect } from "react";
import { memberFields } from "../../utils/memberFields";
import { ChildrenAPI, DepartmentsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ToastProvider";
import "../../styles/pages.css";

export default function EditChild({ child, onUpdated, onCancel }) {
  const { user } = useAuth(); // <- updated from profile to user
  const { showToast } = useToast();
  const { fields } = memberFields["children"];

  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  /* ------------------ LOAD DEPARTMENTS ------------------ */
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await DepartmentsAPI.fetchAll();
        setDepartments(res ?? []);
      } catch (err) {
        console.error(err);
        showToast("Failed to load departments", "error");
      }
    };
    loadDepartments();
  }, [showToast]);

  /* ------------------ INIT FORM ------------------ */
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

  /* ------------------ CHANGE ------------------ */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        showToast(`${field.label} is required`, "error");
        return;
      }
    }

    const payload = { ...formData, church_id: user?.church_id }; // <- use user.church_id
    if (payload.date_of_birth) {
      payload.date_of_birth = new Date(payload.date_of_birth).toISOString();
    }

    setLoading(true);
    try {
      await ChildrenAPI.update(child.id, payload);
      showToast("Child updated successfully", "success");
      onUpdated?.();
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error updating child", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <>
      <h2 className="card-title">Edit Child</h2>
      <p className="card-subtitle">Update child information below.</p>

      <form onSubmit={handleSubmit} className="form-stack">
        {fields.map((field) => (
          <div key={field.name} className="form-group">
            <label className="label">{field.label}</label>

            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                className="input-field"
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
                className="input-field"
              />
            )}
          </div>
        ))}

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Updating…" : "Update Child"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
