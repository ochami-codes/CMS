// src/components/members/MemberList.jsx
import { useEffect, useState, useCallback } from "react";
import { useToast } from "../ToastProvider";
import { MembersAPI } from "../../utils/api";
import { memberFields } from "../../utils/memberFields";

import Table from "../Table";
import MobileCards from "../MobileCards";

export default function MemberList({
  department,
  refreshKey,
  currentUser,
}) {
  const { showToast } = useToast();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const config = memberFields[department];
  const fields = config?.fields ?? [];

  /* ---------------- FETCH ---------------- */
  const loadMembers = useCallback(async () => {
    if (!department) return;

    setLoading(true);
    try {
      const res = await MembersAPI.fetchAll(department);
      setMembers(Array.isArray(res?.members) ? res.members : []);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to fetch members", "error");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [department, showToast]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers, refreshKey]);

  /* ---------------- ACTIONS ---------------- */
  const canEdit = ["Admin", "Clerk"].includes(currentUser?.role);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;

    setDeletingId(id);

    try {
      await MembersAPI.remove(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      showToast("Member deleted", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Delete failed", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    if (!canEdit) return;
    window.location.href = `/members/${department}/edit/${id}`;
  };

  /* ---------------- GUARDS ---------------- */
  if (!department) {
    return (
      <div className="card">
        <h2 className="card-title">Members</h2>
        <p className="card-subtitle">No department selected.</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="card">
        <h2 className="card-title">Members</h2>
        <p className="card-subtitle">Invalid department config.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <p>Loading members…</p>
      </div>
    );
  }

  /* ---------------- TABLE DATA ---------------- */
  const columns = [
    ...fields.map((f) => ({
      key: f.name,
      label: f.label,
    })),
  ];

  const renderActions = (member) => (
    <div className="table-actions">
      {canEdit && (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => handleEdit(member.id)}
        >
          Edit
        </button>
      )}

      <button
        className="btn btn-danger btn-sm"
        onClick={() => handleDelete(member.id)}
        disabled={deletingId === member.id}
      >
        {deletingId === member.id ? "Deleting…" : "Delete"}
      </button>
    </div>
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="card">
      <h2 className="card-title">
        {members[0]?.department_name ?? department} Members
      </h2>

      <p className="card-subtitle">
        Registered members in this department.
      </p>

      {/* DESKTOP */}
      <Table
        columns={columns}
        data={members}
        renderActions={renderActions}
      />

      {/* MOBILE */}
      <MobileCards
        columns={columns}
        data={members}
        renderActions={renderActions}
      />
    </div>
  );
}
