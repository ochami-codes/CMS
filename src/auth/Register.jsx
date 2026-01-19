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
  const [churchAddress, setChurchAddress] = useState("");
  const [churches, setChurches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExistingChurch, setIsExistingChurch] = useState(false);

  const navigate = useNavigate();

  // Fetch existing churches
  useEffect(() => {
    const fetchChurches = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/churches`);
        if (!res.ok) throw new Error("Failed to fetch churches");
        const data = await res.json();
        if (Array.isArray(data)) setChurches(data);
      } catch (err) {
        console.error("Fetch churches error:", err);
        // silently continue; user can type a new church
      }
    };
    fetchChurches();
  }, []);

  // Auto-fill address for existing church
  useEffect(() => {
    const selectedChurch = churches.find((c) => c.name === churchName);
    if (selectedChurch) {
      setChurchAddress(selectedChurch.address || "");
      setIsExistingChurch(true);
    } else {
      setChurchAddress("");
      setIsExistingChurch(false);
    }
  }, [churchName, churches]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (!fullName || !email || !password || !confirmPassword || !churchName || !churchAddress) {
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
          church_address: churchAddress.trim(),
        }),
      });

      const data = await res.json().catch(() => ({})); // fallback empty object

      if (!res.ok) {
        // Try to display meaningful error
        const message =
          data?.details ||
          data?.error ||
          data?.message ||
          "Registration failed. Please check your input.";
        setError(message);
        return;
      }

      // Success
      localStorage.setItem("pending_verification_email", email);
      navigate("/verify-email-info");
    } catch (err) {
      console.error("Registration network error:", err);
      setError("Server unreachable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleRegister} className="space-y-4">
        <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />

        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <div>
          <label className="block mb-1">Church</label>
          <input
            list="churches"
            value={churchName}
            onChange={(e) => setChurchName(e.target.value)}
            placeholder="Type or select a church"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <datalist id="churches">
            {churches.map((c) => (
              <option key={c.id} value={c.name} />
            ))}
          </datalist>
        </div>

        <Input
          label="Church Address"
          value={churchAddress}
          onChange={(e) => setChurchAddress(e.target.value)}
          placeholder="123 Church Street, City"
          required
          readOnly={isExistingChurch}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Register"}
        </Button>
      </form>
    </div>
  );
}
