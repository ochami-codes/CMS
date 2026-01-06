// src/auth/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { API_BASE_URL } from "../config/api";

// Replace with your actual Admin role ID if needed
const ADMIN_ROLE_ID = 1;

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [churchId, setChurchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [churches, setChurches] = useState([]);

  const navigate = useNavigate();

  // Fetch existing churches for dropdown
  useEffect(() => {
    const fetchChurches = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/churches`);
        const data = await res.json();
        setChurches(data || []);
      } catch (err) {
        console.error("Failed to fetch churches:", err);
      }
    };
    fetchChurches();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");

    // Validation
    if (!email || !password || !confirmPassword || !churchId) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, church_id: churchId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setSuccess("Registration successful!");

      // Navigate based on role returned from backend
      if (data.user.role_id === ADMIN_ROLE_ID) {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/member-dashboard", { replace: true });
      }

    } catch (err) {
      console.error(err);
      setError("Server unreachable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container max-w-md mx-auto p-6 relative">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* Church Selection */}
        <div>
          <label className="block mb-1">Church</label>
          <select
            value={churchId}
            onChange={(e) => setChurchId(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Church</option>
            {churches.map((church) => (
              <option key={church.id} value={church.id}>
                {church.name}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Register"}
        </Button>
      </form>
    </div>
  );
}
