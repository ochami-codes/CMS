import { useState, useEffect, useMemo } from "react";

import { memberFields } from "../../utils/memberFields";
import { ChildrenAPI, DepartmentsAPI } from "../../utils/api";
import { useToast } from "../ToastProvider";

import Card from "../Card";

export default function AddChild({ onAdded }) {
  const { showToast } = useToast();

  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const { fields: baseFields = [] } = memberFields["children"] || {};

  /* ---------------- LOAD DEPARTMENTS ---------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await DepartmentsAPI.fetchAll();
        setDepartments(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error(err);
        showToast("Failed to load departments", "error");
      }
    };

    load();
  }, [showToast]);

  /* ---------------- BUILD FIELDS ---------------- */
  const fields = useMemo(() => {
    return baseFields.map((f) => {
      if (f.name === "department") {
        return {
          ...f,
          options: departments.map((d) => ({
            label: d.name,
            value: d.id,
          })),
        };
      }
      return f;
    });
  }, [baseFields, departments]);

  /* ---------------- INIT FORM ---------------- */
  useEffect(() => {
    const initial = {};
    fields.forEach((f) => {
      initial[f.name] = "";
    });
    setFormData(initial);
  }, [fields]);

  /* ---------------- CHANGE ---------------- */
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const f of fields) {
      if (f.required && !formData[f.name]) {
        showToast(`${f.label} is required`, "error");
        return;
      }
    }

    const payload = {
      ...formData,
    };

    if (payload.date_of_birth) {
      payload.date_of_birth = new Date(
        payload.date_of_birth
      ).toISOString();
    }

    setLoading(true);

    try {
      await ChildrenAPI.add(payload);

      showToast("Child added successfully", "success");

      const reset = Object.fromEntries(
        fields.map((f) => [f.name, ""])
      );
      setFormData(reset);

      onAdded?.();
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to add child", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <Card
      title="Add Child"
      subtitle="Register a child and assign them to a department"
    >
      <form className="form-stack" onSubmit={handleSubmit}>

        {fields.map((field) => (
          <div key={field.name} className="form-group">

            <label className="label">
              {field.label}
            </label>

            {field.type === "select" ? (
              <select
                value={formData[field.name]}
                onChange={(e) =>
                  handleChange(field.name, e.target.value)
                }
                className="input"
                required={field.required}
              >
                <option value="">
                  Select {field.label}
                </option>

                {(field.options || []).map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || "text"}
                value={formData[field.name]}
                onChange={(e) =>
                  handleChange(field.name, e.target.value)
                }
                className="input"
                required={field.required}
              />
            )}

          </div>
        ))}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Child"}
        </button>

      </form>
    </Card>
  );
}
