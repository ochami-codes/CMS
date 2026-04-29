import { useState, useEffect } from "react";
import "../../styles/tables.css";
export default function RoleModal({
  member,
  rolesData,
  getRoleLabel,
  onClose,
  onSave,
}) {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [primaryRole, setPrimaryRole] = useState("");

  useEffect(() => {
    if (member) {
      setSelectedRoles(member.roles || []);
      setPrimaryRole(member.primary_role);
    }
  }, [member]);

  if (!member) return null;

  const toggleRole = (role) => {
    setSelectedRoles((prev) => {
      const hasRole = prev.includes(role);

      const updated = hasRole
        ? prev.filter((r) => r !== role)
        : [...prev, role];

      // auto-fix primary role if removed
      if (updated.length === 0) {
  setPrimaryRole("");
} else if (!updated.includes(primaryRole)) {
  setPrimaryRole(updated[0]);
}

      return updated;
    });
  };

  const handleSave = () => {
  try {
    if (!selectedRoles.includes(primaryRole)) {
      alert("Primary role must be selected");
      return;
    }

    if (!member?.id) return;

    onSave({
      id: member.id,
      roles: selectedRoles,
      primary_role: primaryRole,
    });
  } catch (err) {
    console.error("RoleModal save error:", err);
  }
};

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Manage Roles</h2>

        <p className="member-name">{member.full_name}</p>

        {/* Roles */}
        <div className="roles-section">
          {rolesData?.roles?.map((r) => (
            <label key={r.name} className="role-option">
              <input
                type="checkbox"
                checked={selectedRoles.includes(r.name)}
                onChange={() => toggleRole(r.name)}
              />
              {r.label}
            </label>
          ))}
        </div>

        {/* Primary Role */}
        <div className="primary-section">
          <label>Primary Role</label>
          <select
            value={primaryRole}
            onChange={(e) => setPrimaryRole(e.target.value)}
          >
            {selectedRoles.map((r) => (
              <option key={r} value={r}>
                {getRoleLabel(r)}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>

          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
