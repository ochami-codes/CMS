import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../../styles/global.css";
import { API_BASE_URL } from "../../config/api";

export default function MemberList({ department, refresh }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const apiUrl = API_BASE_URL;

  const fetchMembers = async () => {
    if (!apiUrl || !department) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${apiUrl}/admin/members?department=${department}`,
        { credentials: "include" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch members");

      setMembers(data.members || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch members: " + err.message);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [department, refresh]);

  const handleDelete = async (id) => {
    if (!apiUrl || !department) return;
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    setDeletingId(id);
    const toastId = toast.loading("Deleting member...");

    try {
      const res = await fetch(
        `${apiUrl}/admin/members/${id}/delete`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete member");

      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success("Member deleted successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to delete member: " + err.message, { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  if (!department) return <p>No department specified</p>;
  if (loading) return <p>Loading members...</p>;
  if (!members.length) return <p>No members found</p>;

  return (
    <table className="member-list-table">
      <thead>
        <tr>
          {Object.keys(members[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {members.map((m) => (
          <tr key={m.id}>
            {Object.keys(m).map((key) => (
              <td key={key}>{m[key] ?? "-"}</td>
            ))}
            <td>
              <button
                onClick={() => handleDelete(m.id)}
                disabled={deletingId === m.id}
                className="delete-btn"
              >
                {deletingId === m.id ? "Deleting..." : "Delete"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}