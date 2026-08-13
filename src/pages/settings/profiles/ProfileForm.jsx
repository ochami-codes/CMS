// src/profiles/ProfileForm.jsx

import React, { useEffect, useState } from "react";

import styles from "../../../styles/profiles/ProfileForm.module.css";

export default function ProfileForm({
  profile,
  onUpdate,
  loading = false,
}) {
  const [localProfile, setLocalProfile] = useState({
    fullName: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLocalProfile({
      fullName: profile?.full_name ?? "",
      phone: profile?.phone ?? "",
    });

    setErrors({});
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLocalProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    const fullName = localProfile.fullName.trim();
    const phone = localProfile.phone.trim();

    if (!fullName) {
      newErrors.fullName = "Full name is required.";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onUpdate({
      fullName: localProfile.fullName.trim(),
      phone: localProfile.phone.trim(),
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Edit Profile</h2>

      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        {/* FULL NAME */}
        <div className={styles.group}>
          <label
            htmlFor="fullName"
            className={styles.label}
          >
            Full Name
          </label>

          <input
            id="fullName"
            name="fullName"
            type="text"
            value={localProfile.fullName}
            onChange={handleChange}
            className={styles.input}
            disabled={loading}
            autoComplete="name"
          />

          {errors.fullName && (
            <p className={styles.error}>
              {errors.fullName}
            </p>
          )}
        </div>

        {/* PHONE */}
        <div className={styles.group}>
          <label
            htmlFor="phone"
            className={styles.label}
          >
            Phone Number
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={localProfile.phone}
            onChange={handleChange}
            className={styles.input}
            disabled={loading}
            autoComplete="tel"
          />

          {errors.phone && (
            <p className={styles.error}>
              {errors.phone}
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}