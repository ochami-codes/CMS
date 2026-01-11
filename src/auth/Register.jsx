// src/auth/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { API_BASE_URL } from "../config/api";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [churchName, setChurchName] = useState("");
  const [churches, setChurches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchChurches = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/churches`);
        const data = await res.json();
        if (isMounted && Array.isArray(data)) setChurches(data);
      } catch (err) {
        console.error("Failed to fetch churches:", err);
      }
    };
    fetchChurches();
    return () => { isMounted = false; };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");

    if (!fullName || !email || !password || !confirmPassword || !churchName) {
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
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          church_name: churchName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Registration failed");
        setLoading(false);
        return;
      }

      // ✅ Store email locally for resend verification
      localStorage.setItem("unverifiedEmail", email);

      setSuccess("Registration successful! Check your email to verify your account.");

      // Optionally redirect to a "verify email" page
      navigate("/verify-email-info");

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
          label="Full Name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
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

        {/* Church typing / selection */}
        <div>
          <label className="block mb-1">Church</label>
          <input
            list="churches"
            placeholder="Select or type a new church"
            value={churchName}
            onChange={(e) => setChurchName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <datalist id="churches">
            {churches.map((church) => (
              <option key={church.id} value={church.name} />
            ))}
          </datalist>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Register"}
        </Button>
      </form>
    </div>
  );
}
