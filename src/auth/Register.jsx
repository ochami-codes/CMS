import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { AuthAPI } from "../utils/api";
import { kenyaConferences } from "../data/kenyaConferences";
import "../styles/global.css";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [conference, setConference] = useState("");
  const [churchName, setChurchName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !fullName ||
      !email ||
      !phone ||
      !dateOfBirth ||
      !gender ||
      !conference ||
      !churchName ||
      !password ||
      !confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        full_name: fullName,
        email,
        password,
        phone,
        date_of_birth: dateOfBirth,
        gender,
        conference,
        church_name: churchName.trim(),
      };

      const res = await AuthAPI.register(payload);

      setSuccess(
        res.message || "Registration successful! Please verify your email."
      );

      localStorage.setItem("pending_verification_email", email);

      setTimeout(() => {
        navigate("/login", { state: { verified: true } });
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.data?.details ||
          err.message ||
          "Server unreachable. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "480px", marginTop: "3rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Create an Account</h2>

      {error && <p style={{ color: "#e63946", marginBottom: "0.75rem" }}>{error}</p>}
      {success && <p style={{ color: "#16a34a", marginBottom: "0.75rem" }}>{success}</p>}

      <form onSubmit={handleRegister}>
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
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <Input
          label="Date of Birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />

        {/* Gender */}
        <div className="form-group">
          <label>Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Conference */}
        <div className="form-group">
          <label>Conference</label>
          <select
            value={conference}
            onChange={(e) => setConference(e.target.value)}
            required
          >
            <option value="">Select your conference</option>
            {kenyaConferences.map((conf) => (
              <option key={conf} value={conf}>
                {conf}
              </option>
            ))}
          </select>
        </div>

        {/* Church Name with Autocomplete */}
        <div className="form-group">
          <label>Church Name</label>
          <input
            type="text"
            value={churchName}
            onChange={(e) => setChurchName(e.target.value)}
            placeholder="Maai Mahiu SDA Church"
            list="sda-churches"
            required
          />

          <datalist id="sda-churches">
            <option value="Maai Mahiu SDA Church" />
            <option value="Nairobi Central SDA Church" />
            <option value="Kasarani SDA Church" />
            <option value="South C SDA Church" />
            <option value="Kawangware SDA Church" />
            <option value="Nyeri Central SDA Church" />
          </datalist>
        </div>

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

        <Button type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Register"}
        </Button>
      </form>
    </div>
  );
}
