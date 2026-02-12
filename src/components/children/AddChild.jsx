// src/components/members/AddChild.jsx
import { useState, useEffect } from "react";
import { memberFields } from "../../utils/memberFields";
import { ChildrenAPI, DepartmentsAPI } from "../../utils/api";
import { useToast } from "../ToastProvider";
import "../../styles/pages.css";
export default function AddChild({ onAdded }) {
  const { showToast } = useToast();
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

  /* ------------------ SETUP FORM ------------------ */
  const { fields } = memberFields["children"];

  useEffect(() => {
    const initialState = {};
    fields.forEach((f) => {
      if (f.name === "department") {
        f.options = departments.map((d) => d.name);
      }
      initialState[f.name] = "";
    });
    setFormData(initialState);
  }, [fields, departments]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

    const payload = { ...formData };
    if (payload.date_of_birth) {
      payload.date_of_birth = new Date(payload.date_of_birth).toISOString();
    }

    setLoading(true);
    try {
      await ChildrenAPI.add(payload);
      showToast("Child added successfully", "success");

      const reset = {};
      fields.forEach((f) => (reset[f.name] = ""));
      setFormData(reset);

      onAdded?.();
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error adding child", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <main className="page-container">
      <section className="page-card">
        <h2 className="card-title">Add Child</h2>
        <p className="card-subtitle">
          Register a child and assign them to the appropriate department.
        </p>

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

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Saving…" : "Add Child"}
          </button>
        </form>
      </section>
    </main>
  );
}
