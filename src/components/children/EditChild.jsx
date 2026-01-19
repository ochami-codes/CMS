// src/components/members/EditChild.jsx
import { useState, useEffect } from "react";
import { memberFields } from "../../utils/memberFields";
import { DEPARTMENTS } from "../../utils/departments";
import { ChildrenAPI } from "../../utils/api"; // centralized API
import { useAuth } from "../../context/AuthContext";
import Button from "../Button";
import Input from "../Input";
import toast from "react-hot-toast";

export default function EditChild({ child, onUpdated, onCancel }) {
  const { profile } = useAuth();
  const { fields } = memberFields[DEPARTMENTS.CHILDREN];

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // ------------------ INITIALIZE FORM ------------------
  useEffect(() => {
    const data = {};
    fields.forEach(f => {
      data[f.name] = child[f.name] ?? "";
    });
    setFormData(data);
  }, [child, fields]);

  // ------------------ HANDLE CHANGE ------------------
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ------------------ HANDLE SUBMIT ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        toast.error(`${field.label} is required`);
        return;
      }
    }

    // Prepare payload
    const payload = { ...formData, church_id: profile?.church_id };
    if (payload.date_of_birth) {
      payload.date_of_birth = new Date(payload.date_of_birth).toISOString();
    }

    setLoading(true);
    const toastId = toast.loading("Updating child...");

    try {
      const result = await ChildrenAPI.update(child.id, payload);
      if (!result) throw new Error("Failed to update child");

      toast.success("Child updated successfully", { id: toastId });
      onUpdated && onUpdated();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error updating child", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // ------------------ RENDER ------------------
  return (
    <form className="add-member-form" onSubmit={handleSubmit}>
      <h3>Edit Child</h3>

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

      <div className="form-actions">
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
        <Button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
