// src/components/members/ChildrenList.jsx
import { useState, useEffect } from "react";
import { useToast } from "../ToastProvider";
import { DepartmentsAPI, ChildrenAPI } from "../../utils/api";
import AddChild from "./AddChild";
import EditChild from "./EditChild";

export default function ChildrenList() {
  const [children, setChildren] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingChild, setEditingChild] = useState(null);

  const { showToast } = useToast();

  // ------------------ LOAD DEPARTMENTS ------------------
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await DepartmentsAPI.fetchAll();
        setDepartments(res ?? []);
      } catch (err) {
        console.error("Failed to load departments:", err);
        showToast("Failed to load departments", "error");
      }
    };
    loadDepartments();
  }, [showToast]);

  // ------------------ LOAD CHILDREN ------------------
  const loadChildren = async () => {
    setLoading(true);
    try {
      const data = await ChildrenAPI.fetchAll();
      setChildren(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load children:", err);
      showToast("Failed to load children", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  // ------------------ DELETE CHILD ------------------
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

  // ------------------ RENDER ------------------
  return (
    <div className="dashboard-content">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Children Members</h2>

        {/* Add Child Form */}
        <AddChild
          departments={departments}
          onAdded={loadChildren}
        />

        {/* Children Table */}
        {loading ? (
          <p>Loading children…</p>
        ) : children.length === 0 ? (
          <p>No children added yet.</p>
        ) : (
          <table className="member-list-table mt-4">
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
                  <td>{new Date(child.date_of_birth).toLocaleDateString()}</td>
                  <td className="table-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditingChild(child)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
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

        {/* Edit Modal */}
        {editingChild && (
          <div className="modal-overlay">
            <div className="modal-content card">
              <button
                className="modal-close-btn"
                onClick={() => setEditingChild(null)}
              >
                ×
              </button>
              <EditChild
                child={editingChild}
                departments={departments}
                onUpdated={() => {
                  setEditingChild(null);
                  loadChildren();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
