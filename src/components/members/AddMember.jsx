// src/components/members/AddMember.jsx
import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AddMember({ department, onMemberAdded }) { // receive callback
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("members").insert([
      { name, phone, department },
    ]);

    setLoading(false);
    if (!error) {
      setName("");
      setPhone("");
      if (onMemberAdded) onMemberAdded(); // trigger parent refresh
    } else {
      console.error("Failed to add member:", error.message);
    }
  };

  return (
    <form onSubmit={handleAdd} style={{ maxWidth: "400px" }}>
      <h2>Add Member to {department}</h2>

      <label>Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
      />

      <label>Phone</label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
      />

      <button
        disabled={loading}
        style={{
          padding: "8px 16px",
          background: "#0077b6",
          color: "#fff",
          borderRadius: "6px",
          border: "none",
        }}
      >
        {loading ? "Saving..." : "Add Member"}
      </button>
    </form>
  );
}
