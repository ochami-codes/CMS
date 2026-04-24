import { useState, useEffect } from "react";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import Button from "../components/Button";
import EncouragementRedirect from "../components/EncouragementRedirect";
import { AuthAPI } from "../utils/api";
import "../styles/auth.css";

export default function Register() {
  /* -------------------------
     State
  ------------------------- */
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    conferenceId: "",
    churchBaseName: "",
    password: "",
    confirmPassword: "",
  });

  const [conferences, setConferences] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  /* -------------------------
     Helpers
  ------------------------- */

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
      .replace(/\s{2,}/g, " ")
      .trim();

  /* -------------------------
     Load Conferences
  ------------------------- */

  useEffect(() => {
    const loadConferences = async () => {
      try {
        const res = await AuthAPI.getConferences();
        setConferences(res?.conferences || []);
      } catch {
        setConferences([]);
      }
    };

    loadConferences();
  }, []);

  /* -------------------------
     Handlers
  ------------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      global: "",
    }));
  };

  /* -------------------------
     Submit
  ------------------------- */

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};

    // Required fields
    Object.entries(form).forEach(([key, value]) => {
      if (!value?.toString().trim()) {
        newErrors[key] = "This field is required";
      }
    });

    // Password rules
    if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Phone validation
    if (!isValidKenyanPhone(form.phone)) {
      newErrors.phone = "Enter a valid Kenyan phone number";
    }

    if (!form.churchBaseName.trim()) {
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
        conference_id: form.conferenceId,
        church_name: sanitizeChurchBaseName(form.churchBaseName),
      };

      await AuthAPI.register(payload);
      setRegistered(true);
    } catch (err) {
      setErrors({
        global:
          err?.data?.message ||
          err?.message ||
          "Server error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     Redirect
  ------------------------- */

  if (registered) {
    return (
      <EncouragementRedirect
        title="Registration successful 🎉"
        message="Account created successfully. Please verify your email before login."
        redirectTo="/login"
        delay={10000}
      />
    );
  }

  /* -------------------------
     Render
  ------------------------- */

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        {errors.global && (
          <p className="text-error text-center text-sm">
            {errors.global}
          </p>
        )}

        <form onSubmit={handleRegister} className="form-stack">
          <Input
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="07XXXXXXXX"
            error={errors.phone}
          />

          <Input
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
          />

          {/* Gender */}
          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={errors.gender ? "input-error" : ""}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <p className="error-text">{errors.gender}</p>
            )}
          </div>

          {/* Conference */}
          <div className="form-group">
            <label>Conference</label>
            <select
              name="conferenceId"
              value={form.conferenceId}
              onChange={handleChange}
              className={errors.conferenceId ? "input-error" : ""}
            >
              <option value="">Select conference</option>
              {conferences.map((conf) => (
                <option key={conf.id} value={conf.id}>
                  {conf.name}
                </option>
              ))}
            </select>
            {errors.conferenceId && (
              <p className="error-text">{errors.conferenceId}</p>
            )}
          </div>

          {/* Church Name */}
          <div className="form-group">
            <label>Church Name</label>

            <div className="church-input">
              <input
                type="text"
                name="churchBaseName"
                value={form.churchBaseName}
                onChange={handleChange}
                placeholder="Maai Mahiu"
                className={errors.churchBaseName ? "input-error" : ""}
              />
              <span>SDA Church</span>
            </div>

            <small>
              Type only church name. <strong>SDA Church</strong> is added automatically.
            </small>

            {errors.churchBaseName && (
              <p className="error-text">{errors.churchBaseName}</p>
            )}
          </div>

          <PasswordInput
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            showStrength
            error={errors.password}
            required
          />

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Creating account…" : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
