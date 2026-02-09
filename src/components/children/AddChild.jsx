// src/components/members/AddChild.jsx
import { useState, useEffect } from "react";
import { memberFields } from "../../utils/memberFields";
import { ChildrenAPI, DepartmentsAPI } from "../../utils/api";
import { useToast } from "../ToastProvider";

export default function AddChild({ onAdded }) {
  const { showToast } = useToast(); // global toast
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

  // ------------------ SETUP FORM ------------------
  const { fields } = memberFields["children"]; // always children
  useEffect(() => {
    const initialState = {};
    fields.forEach((f) => {
      if (f.name === "department") {
        // dynamically populate department options
        f.options = departments.map((d) => d.name);
      }
      initialState[f.name] = "";
    });
    setFormData(initialState);
  }, [fields, departments]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ------------------ SUBMIT FORM ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
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
      const result = await ChildrenAPI.add(payload);
      if (!result) throw new Error("Failed to add child");

      showToast("Child added successfully", "success");

      // reset form
      const resetState = {};
      fields.forEach((f) => (resetState[f.name] = ""));
      setFormData(resetState);

      onAdded?.();
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error adding child", "error");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ RENDER ------------------
  return (
    <div className="dashboard-content">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Add Child</h3>

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

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Child"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
