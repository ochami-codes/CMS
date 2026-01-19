// src/auth/InviteUser.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Input from "../../components/Input";
import PasswordInput from "../../components/PasswordInput"; // ✅ aligned
import Button from "../../components/Button";
import { API_BASE_URL } from "../../config/api";

export default function InviteUser() {
  const { token } = useAuth(); // JWT from login

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch roles from backend
  useEffect(() => {
    if (!token) return;

    const fetchRoles = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setRoles(data);
        }
      } catch (err) {
        console.error("Failed to fetch roles:", err);
      }
    };

    fetchRoles();
  }, [token]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");

    if (!email || !password || !role) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          password,
          role_name: role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.details || data.error || "Invite failed");
        return;
      }

      setSuccess(`Invite sent to ${email}`);
      setEmail("");
      setPassword("");
      setRole("");
    } catch {
      setError("Server unreachable. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Invite New User</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleInvite} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password with eye toggle */}
        <PasswordInput
          label="Temporary Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          required
        />

        <div>
          <label className="block mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="" disabled>
              Select role
            </option>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Sending invite…" : "Invite User"}
        </Button>
      </form>
    </div>
  );
}
