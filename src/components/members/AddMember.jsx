// src/components/members/AddMember.jsx
import { useState, useMemo, useEffect } from "react";
import { memberFields } from "../../utils/memberFields.js";
import { MembersAPI, DepartmentsAPI, AdminAPI } from "../../utils/api";
import { useToast } from "../ToastProvider";
import "../../styles/pages.css";

export default function AddMember({ department, onMemberAdded }) {
  const config = memberFields[department];
  const fields = config?.fields ?? [];
  const { showToast } = useToast();

  const [memberType, setMemberType] = useState("system"); // system | manual
  const [query, setQuery] = useState("");
const [results, setResults] = useState([]);
const [selectedProfile, setSelectedProfile] = useState(null);
const [searching, setSearching] = useState(false);

  const initialState = useMemo(
    () => Object.fromEntries(fields.map(f => [f.name, ""])),
    [fields]
  );

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [departmentsList, setDepartmentsList] = useState([]);

  /* ---------------- FETCH DEPARTMENTS ---------------- */
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await DepartmentsAPI.fetchAll();
        setDepartmentsList(res ?? []);
      } catch (err) {
        console.error(err);
        showToast("Failed to load departments", "error");
      }
    };
    loadDepartments();
  }, [showToast]);

  /* ---------------- FETCH SYSTEM USERS ---------------- */
  /* SEARCH USERS */
useEffect(() => {
  if (query.length < 2) {
    setResults([]);
    return;
  }

  const search = async () => {
    try {
      setSearching(true);
      const res = await AdminAPI.searchProfiles(query);
      setResults(res?.profiles ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const delay = setTimeout(search, 300);
  return () => clearTimeout(delay);
}, [query]);

  /* ---------------- CHANGE ---------------- */
  const handleChange = (e, name) => {
    setFormData(prev => ({ ...prev, [name]: e.target.value }));
  };

  /* ---------------- SUBMIT ---------------- */
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    let payload;

    if (memberType === "system") {
      if (!selectedProfile) {
        showToast("Please select a user", "error");
        setLoading(false);
        return;
      }

      payload = {
        department,
        profile_id: selectedProfile.id,
        is_system_user: true,
      };
    } else {
      // Validate required fields
      for (const field of fields) {
        if (field.required && !formData[field.name]) {
          showToast(`${field.label} is required`, "error");
          setLoading(false);
          return;
        }
      }

      payload = {
        ...formData,
        department,
        is_system_user: false,
      };
    }

    // Call API
    const result = await MembersAPI.add(payload);

    // Safely extract the member
    const member = result?.member || result?.data?.member;
    if (!member) {
      console.warn("Unexpected API response:", result);
      throw new Error("Failed to add member");
    }

    // Reset form
    setFormData(initialState);
    setSelectedProfile(null);

    // Success toast and callback
    showToast("Member added successfully", "success");
    onMemberAdded?.(member);
  } catch (err) {
    console.error(err);
    showToast(err.message || "Failed to add member", "error");
  } finally {
    setLoading(false);
  }
};
  /* ---------------- UI ---------------- */
  return (
    <>
<h2 className="card-title">
  Add Member
  <span className="card-title-muted"> – {department}</span>

  {config?.type === "age" && (
    <span className="badge badge-warning ml-2">Age Department</span>
  )}

  {config?.type === "ministry" && (
    <span className="badge badge-info ml-2">Ministry</span>
  )}
</h2>
{config?.type === "age" && (
  <p className="card-subtitle text-warning">
    A member can belong to only one age department (e.g. Youth OR Children).
  </p>
)}
      <p className="card-subtitle">
        Add a system user or register a non-system member.
      </p>

      <form onSubmit={handleSubmit} className="form-stack">

        {/* MEMBER TYPE */}
        <div className="form-group">
          <label className="label">Member Type</label>
          <select
            value={memberType}
            onChange={(e) => setMemberType(e.target.value)}
            className="input-field"
          >
            <option value="system">System User</option>
            <option value="manual">Non-System Member</option>
          </select>
        </div>

        {/* SYSTEM USER SELECT */}
       {memberType === "system" && (
  <div className="form-group">
    <label className="label">Search User</label>
    <p className="text-muted">
  Type at least 2 letters to search church members
</p>
    <input
      type="text"
      className="input-field"
      placeholder="Search by name or phone..."
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        setSelectedProfile(null);
      }}
    />

    {searching && (
      <p className="text-muted">Searching...</p>
    )}
    {!searching && query.length >= 2 && results.length === 0 && (
  <p className="text-muted">No users found</p>
)}
    {results.length > 0 && !selectedProfile && (
      <div className="search-dropdown">
        {results.map(p => (
          <div
            key={p.id}
            className="search-item"
            onClick={() => {
              setSelectedProfile(p);
              setQuery(`${p.full_name} (${p.phone || ""})`);
              setResults([]);
            }}
          >
            {p.full_name} {p.phone && `(${p.phone})`}
          </div>
        ))}
      </div>
    )}

    {selectedProfile && (
      <p className="text-success">
        Selected: {selectedProfile.full_name}
      </p>
    )}
  </div>
 )}

        {/* MANUAL MEMBER FORM */}
        {memberType === "manual" &&
          fields.map(f => (
            <div key={f.name} className="form-group">
              <label className="label">{f.label}</label>

              {f.type === "select" ? (
                <select
                  value={formData[f.name] || ""}
                  onChange={e => handleChange(e, f.name)}
                  required={f.required}
                  className="input-field"
                >
                  <option value="">
                    {f.name === "department"
                      ? "Select Department"
                      : `Select ${f.label}`}
                  </option>

                  {f.name === "department"
                    ? departmentsList.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))
                    : f.options?.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  value={formData[f.name] || ""}
                  onChange={e => handleChange(e, f.name)}
                  required={f.required}
                  className="input-field"
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
            {loading ? "Saving…" : "Add Member"}
          </button>
        </div>
      </form>
    </>
  );
}
