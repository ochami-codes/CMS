// src/auth/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { AuthAPI } from "../utils/api";
import { kenyaConferences } from "../data/kenyaConferences";

export default function Register() {
  const navigate = useNavigate();

  // ------------------ Form state ------------------
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    conference: "",
    churchName: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // ------------------ Validation helpers ------------------
  const isValidSdaChurchName = (name) => {
    if (!name) return false;
    return name.trim().toLowerCase().endsWith("sda church");
  };

  const isValidKenyanPhone = (phone) => {
    if (!phone) return false;
    const cleaned = phone.replace(/\s+/g, "");
    const kenyaPhoneRegex = /^(?:\+254|254|0)(7\d{8}|1\d{8})$/;
    return kenyaPhoneRegex.test(cleaned);
  };

  const normalizeKenyanPhone = (phone) => {
    let p = phone.replace(/\s+/g, "");
    if (p.startsWith("0")) p = "254" + p.slice(1);
    if (p.startsWith("+")) p = p.slice(1);
    return p;
  };

  // ------------------ Handle input change ------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ------------------ Handle submit ------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    const newErrors = {};

    // Required fields
    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = "This field is required";
    });

    // Password length
    if (form.password && form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    // Password match
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Church name check
    if (form.churchName && !isValidSdaChurchName(form.churchName)) {
      // We'll auto-append later, so just warn
      newErrors.churchName = "Church name will be auto-corrected to end with 'SDA Church'";
    }

    // Phone check
    if (form.phone && !isValidKenyanPhone(form.phone)) {
      newErrors.phone = "Enter a valid Kenyan phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Auto-append SDA Church if missing
    let churchNameFinal = form.churchName.trim();
    if (!churchNameFinal.toLowerCase().endsWith("sda church")) {
      churchNameFinal += " SDA Church";
    }

    setLoading(true);

    try {
      const payload = {
        full_name: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: normalizeKenyanPhone(form.phone),
        date_of_birth: form.dateOfBirth,
        gender: form.gender,
        conference: form.conference,
        church_name: churchNameFinal,
      };

      const res = await AuthAPI.register(payload);

      // Success message (optional, can skip since redirecting)
      setSuccess(res.message || "Registration successful! Please verify your email.");

      // Save email for reference if needed
      localStorage.setItem("pending_verification_email", form.email);

      // ✅ Redirect to waiting page
      navigate("/verify-pending");
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({ global: err.data?.details || err.message || "Server unreachable. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // ------------------ JSX ------------------
  return (
    <div className="container" style={{ maxWidth: "480px", marginTop: "3rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Create an Account</h2>

      {errors.global && <p style={{ color: "#e63946", marginBottom: "0.75rem" }}>{errors.global}</p>}
      {success && <p style={{ color: "#16a34a", marginBottom: "0.75rem" }}>{success}</p>}

      <form onSubmit={handleRegister} className="space-y-4">
        <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
        {errors.fullName && <p className="error">{errors.fullName}</p>}

        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        {errors.email && <p className="error">{errors.email}</p>}

        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="07XXXXXXXX or +2547XXXXXXXX"
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <Input label="Date of Birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
        {errors.dateOfBirth && <p className="error">{errors.dateOfBirth}</p>}

        {/* Gender */}
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && <p className="error">{errors.gender}</p>}
        </div>

        {/* Conference */}
        <div className="form-group">
          <label>Conference</label>
          <select name="conference" value={form.conference} onChange={handleChange}>
            <option value="">Select your conference</option>
            {kenyaConferences.map((conf) => (
              <option key={conf} value={conf}>{conf}</option>
            ))}
          </select>
          {errors.conference && <p className="error">{errors.conference}</p>}
        </div>

        {/* Church Name */}
        <div className="form-group">
          <label>Church Name</label>
          <input
            type="text"
            name="churchName"
            value={form.churchName}
            onChange={handleChange}
            onBlur={() => {
              if (form.churchName && !form.churchName.toLowerCase().endsWith("sda church")) {
                setForm((prev) => ({ ...prev, churchName: prev.churchName.trim() + " SDA Church" }));
              }
            }}
            placeholder="Maai Mahiu SDA Church"
            list="sda-churches"
          />
          <datalist id="sda-churches">
            <option value="Maai Mahiu SDA Church" />
            <option value="Nairobi Central SDA Church" />
            <option value="Kasarani SDA Church" />
            <option value="South C SDA Church" />
            <option value="Kawangware SDA Church" />
            <option value="Nyeri Central SDA Church" />
          </datalist>
          {errors.churchName && <p className="error">{errors.churchName}</p>}
        </div>

        <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
        {errors.password && <p className="error">{errors.password}</p>}

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Register"}
        </Button>
      </form>
    </div>
  );
}
