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

  // ---------- Helpers ----------
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

    if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!isValidKenyanPhone(form.phone)) newErrors.phone = "Enter a valid Kenyan phone number";
    if (!form.churchBaseName.trim()) newErrors.churchBaseName = "Church name is required";

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
        church_name: sanitizeChurchBaseName(form.churchBaseName),
      };
      await AuthAPI.register(payload);
      setRegistered(true);
    } catch (err) {
      setErrors({
        global: err.data?.details || err.message || "Server unreachable. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------- After Registration ----------
  if (registered) {
    return (
      <EncouragementRedirect
        title="Registration successful 🎉"
        message="Your account has been created successfully. We've sent a verification link to your email, click it and proceed to login."
        redirectTo="/login"
        delay={10000}
      />
    );
  }

  // ---------- Render Form ----------
  return (
    <div className="container max-w-md mt-12">
      <div className="card p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-center">Create an Account</h2>

        {errors.global && <p className="text-red-600 text-center">{errors.global}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
          {errors.fullName && <p className="text-red-600">{errors.fullName}</p>}

          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <p className="text-red-600">{errors.email}</p>}

          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="07XXXXXXXX or +2547XXXXXXXX"
          />
          {errors.phone && <p className="text-red-600">{errors.phone}</p>}

          <Input label="Date of Birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-200"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && <p className="text-red-600">{errors.gender}</p>}
          </div>

          <div className="form-group">
            <label>Conference</label>
            <select
              name="conference"
              value={form.conference}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-200"
            >
              <option value="">Select your conference</option>
              {kenyaConferences.map((conf) => (
                <option key={conf} value={conf}>{conf}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Church Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="churchBaseName"
                value={form.churchBaseName}
                onChange={handleChange} // allow spaces
                placeholder="e.g. Maai Mahiu"
                className="flex-1 border rounded px-3 py-2 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-200"
              />
              <span className="px-3 py-2 bg-gray-200 rounded text-gray-700 whitespace-nowrap">
                SDA Church
              </span>
            </div>
            <small className="text-gray-500">
              Type only the church name. <strong>SDA Church</strong> is added automatically.
            </small>
            {errors.churchBaseName && <p className="text-red-600">{errors.churchBaseName}</p>}
          </div>

          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
          {errors.password && <p className="text-red-600">{errors.password}</p>}

          <Input label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account…" : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
