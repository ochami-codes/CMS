// src/components/members/AddChild.jsx
import { useState } from "react";
import { memberFields } from "../../utils/memberFields";
import { DEPARTMENTS } from "../../utils/departments";
import { ChildrenAPI } from "../../utils/api"; // centralized API
import Button from "../Button";
import Input from "../Input";
import toast from "react-hot-toast";

export default function AddChild({ onAdded }) {
  const { fields } = memberFields[DEPARTMENTS.CHILDREN];

  // Initialize form state dynamically
  const initialState = {};
  fields.forEach(f => (initialState[f.name] = ""));
  const [formData, setFormData] = useState(initialState);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        toast.error(`${field.label} is required`);
        return;
      }
    }

    // Format date fields
    const payload = { ...formData };
    if (payload.date_of_birth) {
      payload.date_of_birth = new Date(payload.date_of_birth).toISOString();
    }

    setLoading(true);
    const toastId = toast.loading("Adding child...");
    try {
      const result = await ChildrenAPI.add(payload);
      if (!result) throw new Error("Failed to add child");

      toast.success("Child added successfully", { id: toastId });
      setFormData(initialState);
      onAdded?.(); // trigger refresh in dashboard
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error adding child", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-member-form" onSubmit={handleSubmit}>
      <h3>Add Child</h3>

      {fields.map(field =>
        field.type === "select" ? (
          <div key={field.name} className="form-group">
            <label>{field.label}</label>
            <select
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ) : (
          <div key={field.name} className="form-group">
            <label>{field.label}</label>
            <Input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
            />
          </div>
        )
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Child"}
      </Button>
    </form>
  );
}
