import { useEffect, useState, useCallback } from "react";

import { useToast } from "../ToastProvider";
import { DepartmentsAPI, ChildrenAPI } from "../../utils/api";

import AddChild from "./AddChild";
import EditChild from "./EditChild";

import Table from "../Table";
import Modal from "../Modal";


export default function ChildrenList() {
  const { showToast } = useToast();

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingChild, setEditingChild] = useState(null);

  /* ---------------- LOAD CHILDREN ---------------- */
  const loadChildren = useCallback(async () => {
    setLoading(true);

    try {
      const data = await ChildrenAPI.fetchAll();
      setChildren(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load children", "error");
      setChildren([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this child?");
    if (!ok) return;

    try {
      await ChildrenAPI.delete(id);
      showToast("Child deleted", "success");
      setChildren((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      showToast(err.message || "Delete failed", "error");
    }
  };

  /* ---------------- TABLE CONFIG ---------------- */
  const columns = [
    { key: "full_name", label: "Child Name" },
    { key: "parent_name", label: "Parent Name" },
    { key: "parent_phone", label: "Parent Phone" },
    {
      key: "date_of_birth",
      label: "Date of Birth",
      render: (row) =>
        row.date_of_birth
          ? new Date(row.date_of_birth).toLocaleDateString()
          : "-",
    },
  ];

  const renderActions = (child) => (
    <div className="table-actions">
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setEditingChild(child)}
      >
        Edit
      </button>

      <button
        className="btn btn-danger btn-sm"
        onClick={() => handleDelete(child.id)}
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="page-container">

      {/* HEADER + ADD CHILD */}
      <section className="page-card">
        <h2 className="card-title">Children Members</h2>
        <p className="card-subtitle">
          Register, update, and manage children in the church.
        </p>

        <AddChild onAdded={loadChildren} />
      </section>

      {/* LIST */}
      <section className="page-card">
        <h3 className="card-title">Registered Children</h3>

        {loading ? (
          <p className="text-muted">Loading children…</p>
        ) : children.length === 0 ? (
          <p className="text-muted">No children found.</p>
        ) : (
          <Table
            columns={columns}
            data={children}
            renderActions={renderActions}
          />
        )}
      </section>

      {/* EDIT MODAL */}
      <Modal
        open={!!editingChild}
        onClose={() => setEditingChild(null)}
      >
        {editingChild && (
          <EditChild
            child={editingChild}
            onUpdated={() => {
              setEditingChild(null);
              loadChildren();
            }}
          />
        )}
      </Modal>
    </div>
  );
}
