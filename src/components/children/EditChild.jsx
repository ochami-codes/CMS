import { useState, useEffect, useMemo } from "react";

import { memberFields } from "../../utils/memberFields";
import { ChildrenAPI, DepartmentsAPI } from "../../utils/api";

import { useToast } from "../ToastProvider";


export default function EditChild({ child, onUpdated, onCancel }) {
  const { showToast } = useToast();

  const { fields = [] } = memberFields["children"] || {};

  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD DEPARTMENTS ---------------- */
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await DepartmentsAPI.fetchAll();
        setDepartments(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error(err);
        showToast("Failed to load departments", "error");
      }
    };

    loadDepartments();
  }, [showToast]);

  /* ---------------- INITIAL FORM DATA ---------------- */
  const initialFormData = useMemo(() => {
    if (!child) return {};

    const data = {};

    fields.forEach((f) => {
      data[f.name] = child?.[f.name] ?? "";
    });

    return data;
  }, [child, fields]);

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    const payload = {
      ...formData,
      date_of_birth: formData.date_of_birth
        ? new Date(formData.date_of_birth).toISOString()
        : undefined,
    };

    setLoading(true);

    try {
      await ChildrenAPI.update(child.id, payload);

      showToast("Child updated successfully", "success");
      onUpdated?.();
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to update child", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div>
      <h2 className="card-title">Edit Child</h2>
      <p className="card-subtitle">Update child information below.</p>

      <form onSubmit={handleSubmit} className="form-stack">
        {fields.map((field) => (
          <div key={field.name} className="form-group">
            <label className="label">{field.label}</label>

            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
                className="input-field"
              >
                <option value="">Select {field.label}</option>

                {field.name === "department"
                  ? departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))
                  : field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
              </select>
            ) : (
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name] || ""}
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
    </div>
  );
}
