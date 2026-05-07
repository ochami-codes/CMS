// src/pages/admin/ManageRoles.jsx
import { useEffect, useState } from "react";
import { AdminAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";
import { Check, X } from "lucide-react";
import "../../styles/pages.css";
import "../../styles/tables.css";
import RoleModal from "./RoleModal";

export default function ManageRoles() {
  const { user, setUser, getRoleLabel } = useAuth();
  const { showToast } = useToast();

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const [processingId, setProcessingId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  /* ------------------ Fetch Members ------------------ */
  const fetchMembers = useCallback(async () => {
    if (!user?.church_id) return;

    setLoadingMembers(true);
    try {
      const params = new URLSearchParams({ search }).toString();
      const data = await AdminAPI.fetchMembers(params);

      setMembers(
        (data.members ?? []).map((m) => ({
          ...m,
          departments: m.departments ?? [],
        }))
      );
    } catch {
      showToast("Failed to load members", "error");
    } finally {
      setLoadingMembers(false);
    }
  }, [user?.church_id, search, showToast]);

  /* ------------------ Initial Load ------------------ */
  useEffect(() => {
    if (user?.church_id) fetchMembers();
  }, [user?.church_id, fetchMembers]);

  /* ------------------ Toggle Active ------------------ */
  const toggleMember = async (id, active) => {
    if (
      !window.confirm(
        active
          ? "Deactivate this member?"
          : "Activate this member?"
      )
    )
      return;

    setProcessingId(id);
    try {
      active
        ? await AdminAPI.deactivateMember(id)
        : await AdminAPI.activateMember(id);

      setMembers((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, active: !active } : m
        )
      );

      showToast(active ? "Member deactivated" : "Member activated");
    } catch {
      showToast("Action failed", "error");
    } finally {
      setProcessingId(null);
    }
  };

  if (!user) return null;

const renderRoles = (roles = []) => (
  <div className="roles-container">
    {roles.map((r) => (
      <span key={r} className="role-badge">
        {getRoleLabel(r)}
      </span>
    ))}
  </div>
);
  return (
    <>
      {/* ------------------ Header ------------------ */}
      <div className="card">
        <h2 className="card-title">Admin Members & Roles</h2>
        <input
          placeholder="Search members…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />
      </div>

      {/* ------------------ Members ------------------ */}
      <div className="card">
        <h3 className="card-title">Manage Members</h3>

        {loadingMembers ? (
          <div>Loading members…</div>
        ) : members.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            No members found
          </div>
        ) : (
          <>
            {/* -------- DESKTOP TABLE -------- */}
            <div className="desktop-table">
              <div className="table-scroll">
                <table className="members-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Roles</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {members.map((m) => (
                      <tr
                        key={m.id}
                        style={!m.active ? { opacity: 0.6 } : {}}
                      >
                        <td>{m.full_name}</td>

                        <td>
                          {m.departments.length > 0
                            ? m.departments.join(", ")
                            : "-"}
                        </td>

                        <td>
                          {m.active ? "Active" : "Inactive"}
                        </td>

<td>{renderRoles(m.roles)}</td>
                        <td className="actions">
                          {m.is_system_user && (
                            <>
                              <button
                                className="btn btn-warning"
                                onClick={() =>
                                  setSelectedMember(m)
                                }
                              >
                                Manage Roles
                              </button>

                              <button
                                className={`btn ${
                                  m.active
                                    ? "btn-danger"
                                    : "btn-success"
                                } action-btn`}
                                disabled={processingId === m.id}
                                onClick={() =>
                                  toggleMember(m.id, m.active)
                                }
                              >
                                {m.active ? (
                                  <>
                                    <X size={16} />{" "}
                                    <span>Deactivate</span>
                                  </>
                                ) : (
                                  <>
                                    <Check size={16} />{" "}
                                    <span>Activate</span>
                                  </>
                                )}
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* -------- MOBILE CARDS -------- */}
            <div className="mobile-cards">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="member-card"
                  style={!m.active ? { opacity: 0.6 } : {}}
                >
                  <h3>{m.full_name}</h3>

                  <p>
                    <strong>Department:</strong>{" "}
                    {m.departments.length > 0
                      ? m.departments.join(", ")
                      : "-"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {m.active ? "Active" : "Inactive"}
                  </p>

     <div>
  <strong>Roles:</strong>
  {renderRoles(m.roles)}
</div>
                  <div className="card-actions">
                    {m.is_system_user && (
                      <>
                        <button
                          className="btn btn-warning"
                          onClick={() =>
                            setSelectedMember(m)
                          }
                        >
                          Manage Roles
                        </button>

                        <button
                          className={`btn ${
                            m.active
                              ? "btn-danger"
                              : "btn-success"
                          }`}
                          disabled={processingId === m.id}
                          onClick={() =>
                            toggleMember(m.id, m.active)
                          }
                        >
                          {m.active
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ------------------ Role Modal ------------------ */}
      {selectedMember && (
        <RoleModal
          member={selectedMember}
          rolesData={rolesData}
          getRoleLabel={getRoleLabel}
          onClose={() => setSelectedMember(null)}
onSave={async (data) => {
  console.log("updates:", data);

  try {
    const res = await AdminAPI.updateMemberRoles(data.id, data);

    console.log("response:", res);

    setMembers((prev) =>
      prev.map((m) =>
        m.id === data.id
          ? {
              ...m,
              roles: data.roles,
              primary_role: data.primary_role,
            }
          : m
      )
    );

    if (data.id === user.id) {
      setUser((u) => ({
        ...u,
        roles: data.roles,
        primary_role: data.primary_role,
      }));
    }

    showToast("Roles updated");
    setSelectedMember(null);

  } catch (err) {
    console.error("Role update failed:", err);

    // If backend sends useful error messages:
    if (err?.response) {
      console.error("Server response:", err.response.data);
    }

    showToast("Failed to update roles", "error");
  }
}}
        />
      )}
    </>
  );
}
