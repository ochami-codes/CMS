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

  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const navigate = useNavigate();

  // Fetch existing churches
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

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");
    setResendMessage("");

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
          full_name: fullName.trim(),
          email: email.trim(),
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

      // Display success / verification message
      setSuccess(data?.message || "Registration successful! Please verify your email.");

    } catch (err) {
      console.error(err);
      setError("Server unreachable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle resend verification email
  const handleResend = async () => {
    if (resendLoading || !email) return;

    setResendLoading(true);
    setResendMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      setResendMessage(data?.message || "Verification email resent!");
    } catch (err) {
      console.error(err);
      setResendMessage("Failed to resend verification email. Try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-container max-w-md mx-auto p-6 relative">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && (
        <div className="mb-2">
          <p className="text-green-600">{success}</p>

          {/* Resend button */}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-blue-600 underline mt-1"
          >
            {resendLoading ? "Resending…" : "Resend verification email"}
          </button>

          {resendMessage && <p className="text-green-600 mt-1">{resendMessage}</p>}
        </div>
      )}

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

        {/* Church input */}
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
            {churches.map((c) => (
              <option key={c.id} value={c.name} />
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
