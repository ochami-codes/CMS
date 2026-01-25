// src/auth/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { AuthAPI } from "../utils/api";
import { kenyaConferences } from "../data/kenyaConferences";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [conference, setConference] = useState("");
  const [churchName, setChurchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName || !email || !phone || !dateOfBirth || !gender || !conference || !churchName) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        full_name: fullName,
        email,
        phone,
        date_of_birth: dateOfBirth,
        gender,
        conference,
        church_name: churchName.trim(),
      };

      const res = await AuthAPI.register(payload);

      setSuccess(res.message || "Registration successful! Please verify your email.");

      // Optionally store pending email
      localStorage.setItem("pending_verification_email", email);

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
        <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input label="Phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
        <Input label="Date of Birth" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required />

        <div>
          <label className="block mb-1">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Conference</label>
          <select
            value={conference}
            onChange={(e) => setConference(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select your conference</option>
            {kenyaConferences.map((conf) => (
              <option key={conf} value={conf}>
                {conf}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Church Name"
          value={churchName}
          onChange={e => setChurchName(e.target.value)}
          placeholder="Type your church"
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Register"}
        </Button>
      </form>
    </div>
  );
}
