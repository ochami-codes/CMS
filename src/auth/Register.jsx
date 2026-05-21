import { useState } from "react";

import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import Button from "../components/Button";
import EncouragementRedirect from "../components/EncouragementRedirect";

import { AuthAPI } from "../utils/api";

import styles from "../styles/pages/Register.module.css";

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

export default function Register() {

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

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

  const handleRegister = async (e) => {
    e.preventDefault();

    setErrors({});

    const newErrors = {};

    Object.entries(form).forEach(([key, value]) => {
      if (!value?.toString().trim()) {
        newErrors[key] = "This field is required";
      }
    });

    if (form.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    if (!isValidKenyanPhone(form.phone)) {
      newErrors.phone =
        "Enter a valid Kenyan phone number";
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
     Success redirect screen
  ------------------------- */

  if (registered) {
    return (
      <EncouragementRedirect
        title="Registration successful 🎉"
        message="Please check your email to verify your account before logging in."
        redirectTo="/login"
        delay={8000}
      />
    );
  }

  return (
    <div className={styles.container}>

      <div className={styles.card}>

        <h2 className={styles.title}>
          Create Account
        </h2>

        {errors.global && (
          <p className={styles.error}>
            {errors.global}
          </p>
        )}

        <form
          onSubmit={handleRegister}
          className={styles.form}
        >

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
          <div className={styles.selectGroup}>

            <label>Gender</label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={
                errors.gender
                  ? styles.selectError
                  : styles.select
              }
            >
              <option value="">
                Select gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

            </select>

            {errors.gender && (
              <p className={styles.error}>
                {errors.gender}
              </p>
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
            {loading
              ? "Creating account…"
              : "Register"}
          </Button>

        </form>

      </div>

    </div>
  );
}
