// src/components/members/ChildrenList.jsx
import { useState, useEffect } from "react";
import { DEPARTMENTS } from "../../utils/departments";
import { memberFields } from "../../utils/memberFields";
import AddChild from "./AddChild";
import EditChild from "./EditChild";
import { ChildrenAPI } from "../../utils/api"; // centralized API
import toast from "react-hot-toast";

export default function ChildrenList() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingChild, setEditingChild] = useState(null);

  // ------------------ LOAD CHILDREN ------------------
  const loadChildren = async () => {
    setLoading(true);
    try {
      const data = await ChildrenAPI.fetch();
      setChildren(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load children");
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
    const toastId = toast.loading("Deleting child...");
    try {
      const success = await ChildrenAPI.delete(id);
      if (!success) throw new Error("Failed to delete child");
      toast.success("Child deleted successfully", { id: toastId });
      loadChildren();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error deleting child", { id: toastId });
    }
  };

  // ------------------ RENDER ------------------
  return (
    <div className="children-list-container">
      <h2>Children Members</h2>

      {/* Add Child Form */}
      <AddChild onAdded={loadChildren} />

      {/* Children Table */}
      {loading ? (
        <p>Loading children…</p>
      ) : children.length === 0 ? (
        <p>No children added yet.</p>
      ) : (
        <table className="member-list-table">
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
                <td>
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
          <div className="modal-content">
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
    </div>
  );
}
