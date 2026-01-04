import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

export default function EditMember({ department }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/members/${id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch member");

        const data = await res.json();
        setMember(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!member) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/admin/members/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: member.name,
          phone: member.phone,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update member");
      }

      navigate(`/dashboard/${department}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading member…</p>;
  if (!member) return <p>No member found</p>;

  return (
    <form onSubmit={handleUpdate} style={{ maxWidth: "400px" }}>
      <h2>Edit Member</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>Name</label>
      <input
        type="text"
        value={member.name ?? ""}
        onChange={(e) =>
          setMember({ ...member, name: e.target.value })
        }
        style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
      />

      <label>Phone</label>
      <input
        type="tel"
        value={member.phone ?? ""}
        onChange={(e) =>
          setMember({ ...member, phone: e.target.value })
        }
        style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
      />

      <button
        type="submit"
        disabled={saving}
        style={{
          padding: "8px 16px",
          background: "#0077b6",
          color: "#fff",
          borderRadius: "6px",
          border: "none",
        }}
      >
        {saving ? "Saving…" : "Update Member"}
      </button>
    </form>
  );
}