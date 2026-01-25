// src/auth/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { AuthAPI } from "../utils/api";

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
  const [success, setSuccess] = useState("");
  const [isExistingChurch, setIsExistingChurch] = useState(false);

  const navigate = useNavigate();

  // Fetch existing churches from backend
  useEffect(() => {
    const fetchChurches = async () => {
      try {
        const data = await AuthAPI.fetchChurches();
        if (Array.isArray(data)) setChurches(data);
      } catch (err) {
        console.error("Failed to fetch churches:", err);
      }
    };
    fetchChurches();
  }, []);

  // Autofill address if church exists
  useEffect(() => {
    const selected = churches.find((c) => c.name === churchName);
    if (selected?.address) {
      setChurchAddress(selected.address);
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
    setSuccess("");

    if (!fullName || !email || !password || !confirmPassword || !churchName) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await AuthAPI.register({
        full_name: fullName,
        email,
        password,
        church_name: churchName.trim(),
        church_address: churchAddress.trim(),
      });

      // Optionally store pending verification email
      localStorage.setItem("pending_verification_email", email);

      setSuccess(res.message || "Registration successful. Please verify your email.");

      // Redirect to login page after short delay
      setTimeout(() => {
        navigate("/login", { state: { verified: true } });
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.data?.details || err.message || "Server unreachable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          label="Full Name"
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

        {/* Church Name */}
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

        {/* Church Address */}
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
