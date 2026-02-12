// src/components/members/ChildrenList.jsx
import { useState, useEffect } from "react";
import { useToast } from "../ToastProvider";
import { DepartmentsAPI, ChildrenAPI } from "../../utils/api";
import AddChild from "./AddChild";
import EditChild from "./EditChild";
import "../../styles/pages.css";
export default function ChildrenList() {
  const [children, setChildren] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingChild, setEditingChild] = useState(null);

  const { showToast } = useToast();

  /* ------------------ LOAD DEPARTMENTS ------------------ */
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await DepartmentsAPI.fetchAll();
        setDepartments(res ?? []);
      } catch (err) {
        console.error(err);
        showToast("Failed to load departments", "error");
      }
    };
    loadDepartments();
  }, [showToast]);

  /* ------------------ LOAD CHILDREN ------------------ */
  const loadChildren = async () => {
    setLoading(true);
    try {
      const data = await ChildrenAPI.fetchAll();
      setChildren(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load children", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  /* ------------------ DELETE ------------------ */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this child?")) return;

    try {
      await ChildrenAPI.delete(id);
      showToast("Child deleted successfully", "success");
      loadChildren();
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error deleting child", "error");
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <main className="page-container">
      {/* ADD CHILD */}
      <section className="page-card">
        <h2 className="card-title">Children Members</h2>
        <p className="card-subtitle">
          Register, update, and manage children in the church.
        </p>

        <AddChild onAdded={loadChildren} />
      </section>

      {/* CHILDREN LIST */}
      <section className="page-card">
        <h3 className="card-title">Registered Children</h3>

        {loading ? (
          <p className="text-muted">Loading children…</p>
        ) : children.length === 0 ? (
          <p className="text-muted">No children added yet.</p>
        ) : (
          <table className="members-table">
            <thead>
              <tr>
                <th>Child Name</th>
                <th>Parent Name</th>
                <th>Parent Phone</th>
                <th>Date of Birth</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {children.map((child) => (
                <tr key={child.id}>
                  <td>{child.full_name}</td>
                  <td>{child.parent_name}</td>
                  <td>{child.parent_phone}</td>
                  <td>
                    {new Date(child.date_of_birth).toLocaleDateString()}
                  </td>
                  <td style={{ display: "flex", gap: "0.5rem" }}>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* EDIT MODAL */}
      {editingChild && (
        <div className="modal-overlay">
          <div className="modal-content page-card">
            <button
              className="modal-close-btn"
              onClick={() => setEditingChild(null)}
            >
              ×
            </button>

            <EditChild
              child={editingChild}
              onUpdated={() => {
                setEditingChild(null);
                loadChildren();
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
