// src/auth/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import EncouragementRedirect from "../components/EncouragementRedirect";
import { AuthAPI } from "../utils/api";
import { kenyaConferences } from "../data/kenyaConferences";

export default function Register() {
  const navigate = useNavigate();

  /* ------------------ Form state ------------------ */
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    conference: "",
    churchBaseName: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  /* ------------------ Helpers ------------------ */
  const isValidKenyanPhone = (phone) => {
    if (!phone) return false;
    const cleaned = phone.replace(/\s+/g, "");
    return /^(?:\+254|254|0)(7\d{8}|1\d{8})$/.test(cleaned);
  };

  const normalizeKenyanPhone = (phone) => {
    let p = phone.replace(/\s+/g, "");
    if (p.startsWith("0")) p = "254" + p.slice(1);
    if (p.startsWith("+")) p = p.slice(1);
    return p;
  };

  const sanitizeChurchBaseName = (value) =>
    value
      .replace(/\b(sda|church|seventh day adventist)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();

  /* ------------------ Handlers ------------------ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};

    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = "This field is required";
    });

    if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!isValidKenyanPhone(form.phone)) {
      newErrors.phone = "Enter a valid Kenyan phone number";
    }

    if (!form.churchBaseName) {
      newErrors.churchBaseName = "Church name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
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
        church_name: form.churchBaseName.trim(),
      };

      await AuthAPI.register(payload);

      setRegistered(true);
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({
        global:
          err.data?.details ||
          err.message ||
          "Server unreachable. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Success Screen ------------------ */
  if (registered) {
    return (
      <EncouragementRedirect
        title="Registration successful 🎉"
        message="Your account has been created successfully."
        redirectTo="/login"
        delay={10000}
      />
    );
  }

  /* ------------------ JSX ------------------ */
  return (
    <div className="container" style={{ maxWidth: "480px", marginTop: "3rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Create an Account</h2>

      {errors.global && (
        <p style={{ color: "#e63946", marginBottom: "0.75rem" }}>
          {errors.global}
        </p>
      )}

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

        <Input
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={form.dateOfBirth}
          onChange={handleChange}
        />

        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && <p className="error">{errors.gender}</p>}
        </div>

        <div className="form-group">
          <label>Conference</label>
          <select name="conference" value={form.conference} onChange={handleChange}>
            <option value="">Select your conference</option>
            {kenyaConferences.map((conf) => (
              <option key={conf} value={conf}>{conf}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Church Name</label>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="text"
              name="churchBaseName"
              value={form.churchBaseName}
              onChange={(e) => {
                const clean = sanitizeChurchBaseName(e.target.value);
                setForm((prev) => ({ ...prev, churchBaseName: clean }));
              }}
              placeholder="e.g. Maai Mahiu"
              style={{ flex: 1 }}
            />

            <span
              style={{
                padding: "0.6rem 0.75rem",
                background: "#f3f4f6",
                borderRadius: "6px",
                fontSize: "0.9rem",
                whiteSpace: "nowrap",
              }}
            >
              SDA Church
            </span>
          </div>

          <small style={{ color: "#6b7280" }}>
            Type only the church name. <strong>SDA Church</strong> is added automatically.
          </small>
        </div>

        <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Register"}
        </Button>
      </form>
    </div>
  );
}
