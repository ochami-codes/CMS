import { useState } from "react";

import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import Button from "../components/Button";
import EncouragementRedirect from "../components/EncouragementRedirect";

import { useRegister } from "../hooks/auth/useRegister";

import {
  validateRegistration,
  createRegistrationPayload,
} from "../utils/registerValidation";

import styles from "../styles/pages/Register.module.css";

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
  const [registered, setRegistered] = useState(false);

  const {
    mutate: register,
    isPending,
  } = useRegister();

  /* -------------------------
     Handle Input Change
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
     Handle Registration
  ------------------------- */

  const handleRegister = (e) => {
    e.preventDefault();

    setErrors({});

    /* Validate form */
    const validationErrors = validateRegistration(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    /* Create API payload */
    const payload = createRegistrationPayload(form);

    /* Execute registration mutation */
    register(payload, {
      onSuccess: () => {
        setRegistered(true);
      },

      onError: (err) => {
        setErrors({
          global:
            err?.data?.message ||
            err?.message ||
            "Server error. Please try again.",
        });
      },
    });
  };

  /* -------------------------
     Success Screen
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
            loading={isPending}
            className="btn-primary w-full"
          >
            {isPending
              ? "Creating account…"
              : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
