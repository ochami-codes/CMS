// src/components/members/EditMember.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { memberFields } from "../../utils/memberFields";
import { MembersAPI, DepartmentsAPI } from "../../utils/api";
import { useToast } from "../ToastProvider";
import "../../styles/pages.css";
export default function EditMember({ department, onUpdated }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const config = memberFields[department];
  const fields = config?.fields ?? [];

  const [formData, setFormData] = useState({});
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    if (!department || !id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const deptRes = await DepartmentsAPI.fetchAll();
        setDepartments(Array.isArray(deptRes) ? deptRes : []);

        const res = await MembersAPI.fetchAll(department);
        const member = res?.members?.find((m) => m.id === id);
        if (!member) throw new Error("Member not found");

        const initialData = {};
        fields.forEach((f) => {
          initialData[f.name] =
            f.name === "department"
              ? member.department_id ?? ""
              : member[f.name] ?? "";
        });

        setFormData(initialData);
      } catch (err) {
        console.error(err);
        showToast(err.message || "Failed to load member", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [department, id, fields, showToast]);

  /* ---------------- UPDATE ---------------- */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      for (const field of fields) {
        if (field.required && !formData[field.name]) {
          throw new Error(`${field.label} is required`);
        }
      }

      const payload = { ...formData };
      if (payload.department) payload.department_id = payload.department;

      await MembersAPI.update(id, payload);
      showToast("Member updated successfully", "success");
      onUpdated?.();
      navigate(`/dashboard/${department}`);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to update member", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- STATES ---------------- */
  if (loading) {
    return (
      <div className="page-container">
        <div className="page-card">Loading member…</div>
      </div>
    );
  }

  if (!Object.keys(formData).length) {
    return (
      <div className="page-container">
        <div className="page-card">No member data found.</div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="page-container">
      <div className="page-card">
        <h2 className="card-title">
          Edit {department.replace("_", " ")}
        </h2>

        <p className="card-subtitle">
          Update member details and save changes.
        </p>

        <form onSubmit={handleUpdate}>
          {fields.map((f) => (
            <div key={f.name} className="form-group">
              <label>{f.label}</label>

              {f.type === "select" ? (
                <select
                  value={formData[f.name]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [f.name]: e.target.value,
                    }))
                  }
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
                  value={formData[f.name]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [f.name]: e.target.value,
                    }))
                  }
                  required={f.required}
                  className="input"
                />
              )}
            </div>
          ))}

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? "Saving…" : "Update Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
