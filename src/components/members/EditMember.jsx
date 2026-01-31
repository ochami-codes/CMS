// src/components/members/EditMember.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { memberFields } from "../../config/api";
import { MembersAPI } from "../../utils/api"; // centralized API

export default function EditMember({ department, onUpdated }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const config = memberFields[department];
  const fields = config?.fields ?? [];

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ------------------ FETCH MEMBER ------------------
  useEffect(() => {
    if (!department || !id) return;

    const fetchMember = async () => {
      setLoading(true);
      try {
        const data = await MembersAPI.fetchAll(department);
        const member = data?.members?.find(m => m.id === id);
        if (!member) throw new Error("Member not found");

        const initialData = {};
        fields.forEach(f => (initialData[f.name] = member[f.name] ?? ""));
        setFormData(initialData);
      } catch (err) {
        console.error("Fetch member error:", err);
        toast.error(err.message || "Failed to fetch member");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [department, id, fields]);

  // ------------------ HANDLE CHANGE ------------------
  const handleChange = (e, name) => {
    setFormData(prev => ({ ...prev, [name]: e.target.value }));
  };

  // ------------------ SAVE UPDATE ------------------
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate required fields
      for (const field of fields) {
        if (field.required && !formData[field.name]) {
          throw new Error(`${field.label} is required`);
        }
      }

      await MembersAPI.update(id, formData);
      toast.success("Member updated successfully!");
      onUpdated?.();
      navigate(`/dashboard/${department}`);
    } catch (err) {
      console.error("Update member error:", err);
      toast.error(err.message || "Failed to update member");
    } finally {
      setSaving(false);
    }
  };

  // ------------------ RENDER ------------------
  if (loading) return <p>Loading member…</p>;
  if (!formData || !Object.keys(formData).length) return <p>No member data</p>;

  return (
    <form onSubmit={handleUpdate} className="edit-member-form">
      <h2>Edit {department.replace("_", " ")}</h2>

      {fields.map(f => (
        <div key={f.name} className="form-group">
          <label>{f.label}</label>
          {f.type === "select" ? (
            <select
              name={f.name}
              value={formData[f.name]}
              onChange={e => handleChange(e, f.name)}
              required={f.required}
            >
              <option value="">Select {f.label}</option>
              {f.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={f.type || "text"}
              name={f.name}
              value={formData[f.name]}
              onChange={e => handleChange(e, f.name)}
              required={f.required}
            />
          )}
        </div>
      ))}

      <button type="submit" disabled={saving} className="btn btn-primary">
        {saving ? "Saving…" : "Update Member"}
      </button>
    </form>
  );
}
