// src/components/members/EditMember.jsx
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function EditMember({ department }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      const { data } = await supabase
        .from("members")
        .select("*")
        .eq("id", id)
        .single();
      setMember(data);
      setLoading(false);
    };

    fetchMember();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("members")
      .update({
        name: member.name,
        phone: member.phone,
      })
      .eq("id", id);

    if (!error) navigate(`/dashboard/${department}`);
  };

  if (loading) return <p>Loading...</p>;
  if (!member) return <p>No member found</p>;

  return (
    <form onSubmit={handleUpdate} style={{ maxWidth: "400px" }}>
      <h2>Edit Member</h2>

      <label>Name</label>
      <input
        value={member.name}
        onChange={(e) => setMember({ ...member, name: e.target.value })}
        style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
      />

      <label>Phone</label>
      <input
        value={member.phone}
        onChange={(e) => setMember({ ...member, phone: e.target.value })}
        style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
      />

      <button
        style={{
          padding: "8px 16px",
          background: "#0077b6",
          color: "#fff",
          borderRadius: "6px",
          border: "none",
        }}
      >
        Update Member
      </button>
    </form>
  );
}