import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function MemberList({ department }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, [department]);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("department", department)
      .order("created_at", { ascending: false });

    if (!error) setMembers(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    const { error } = await supabase.from("members").delete().eq("id", id);
    if (!error) setMembers(members.filter((m) => m.id !== id));
  };

  if (loading) return <p>Loading members...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>
        {department.toUpperCase()} Members
      </h2>

      <Link
        to={`/dashboard/${department}/add`}
        style={{
          padding: "6px 14px",
          background: "#0077b6",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
        }}
      >
        Add Member
      </Link>

      <table
        style={{
          width: "100%",
          marginTop: "1rem",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        }}
      >
        <thead>
          <tr style={{ background: "#f1f1f1" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Phone</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {members.map((m) => (
            <tr key={m.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px" }}>{m.name}</td>
              <td style={{ padding: "8px" }}>{m.phone}</td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() =>
                    navigate(`/dashboard/${department}/edit/${m.id}`)
                  }
                  style={{
                    padding: "4px 10px",
                    background: "#555",
                    color: "#fff",
                    borderRadius: "4px",
                    marginRight: "10px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(m.id)}
                  style={{
                    padding: "4px 10px",
                    background: "#e63946",
                    color: "#fff",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {members.length === 0 && (
            <tr>
              <td colSpan="3" style={{ padding: "8px", textAlign: "center" }}>
                No members found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
