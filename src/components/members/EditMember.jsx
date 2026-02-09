// src/components/members/EditMember.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { memberFields } from "../../utils/memberFields";
import { MembersAPI, DepartmentsAPI } from "../../utils/api";
import { useToast } from "../ToastProvider";

export default function EditMember({ department, onUpdated }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast(); // global toast

  const config = memberFields[department];
  const fields = config?.fields ?? [];

  const [formData, setFormData] = useState({});
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ------------------ FETCH MEMBER & DEPARTMENTS ------------------
  useEffect(() => {
    if (!department || !id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch live departments
        const deptRes = await DepartmentsAPI.fetchAll();
        setDepartments(Array.isArray(deptRes?.departments) ? deptRes.departments : []);

        // Fetch member
        const data = await MembersAPI.fetchAll(department);
        const member = data?.members?.find((m) => m.id === id);
        if (!member) throw new Error("Member not found");

        const initialData = {};
        fields.forEach((f) => {
          if (f.name === "department") {
            // store department_id for select
            initialData[f.name] = member.department_id ?? "";
          } else {
            initialData[f.name] = member[f.name] ?? "";
          }
        });
        setFormData(initialData);
      } catch (err) {
        console.error("Fetch member error:", err);
        showToast(err.message || "Failed to fetch member", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [department, id, fields, showToast]);

  // ------------------ HANDLE CHANGE ------------------
  const handleChange = (e, name) => {
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));
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

      // Prepare payload
      const payload = { ...formData };
      if (payload.department) payload.department_id = payload.department;

      await MembersAPI.update(id, payload);
      showToast("Member updated successfully!", "success");
      onUpdated?.();
      navigate(`/dashboard/${department}`);
    } catch (err) {
      console.error("Update member error:", err);
      showToast(err.message || "Failed to update member", "error");
    } finally {
      setSaving(false);
    }
  };

  // ------------------ RENDER ------------------
  if (loading) return <p>Loading member…</p>;
  if (!formData || !Object.keys(formData).length) return <p>No member data</p>;

  return (
    <div className="dashboard-content">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">
          Edit {department.replace("_", " ")}
        </h2>

        <form onSubmit={handleUpdate}>
          {fields.map((f) => (
            <div key={f.name} className="form-group">
              <label>{f.label}</label>
              {f.type === "select" ? (
                <select
                  name={f.name}
                  value={formData[f.name]}
                  onChange={(e) => handleChange(e, f.name)}
                  required={f.required}
                  className="input"
                >
                  <option value="">Select {f.label}</option>
                  {f.name === "department"
                    ? departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))
                    : f.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  name={f.name}
                  value={formData[f.name]}
                  onChange={(e) => handleChange(e, f.name)}
                  required={f.required}
                  className="input"
                />
              )}
            </div>
          ))}

          <div className="mt-4">
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? "Saving…" : "Update Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
