// src/profiles/ProfileForm.jsx
import React, { useState, useEffect } from "react";
import Toast from "../../../components/Toast";
import styles from "../../../styles/profiles/ProfileForm.module.css";

export default function ProfileForm({ profile, onUpdate, loading, message }) {
  const [localProfile, setLocalProfile] = useState(profile);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  useEffect(() => {
    if (message) {
      setToast({
        text: message,
        type: message.includes("successfully") ? "success" : "error",
      });
    }
  }, [message]);

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

    if (!localProfile.fullName?.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!localProfile.phone?.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!localProfile.email?.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(localProfile.email)) {
      newErrors.email = "Invalid email format.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onUpdate(localProfile);
  };

  return (
    <div className={styles.card}>
      {toast && (
        <Toast
          message={toast.text}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h2 className={styles.title}>Edit Profile</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* FULL NAME */}
        <div className={styles.group}>
          <label htmlFor="fullName" className={styles.label}>
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={localProfile.fullName || ""}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.fullName && <p className={styles.error}>{errors.fullName}</p>}
        </div>

        {/* PHONE */}
        <div className={styles.group}>
          <label htmlFor="phone" className={styles.label}>
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={localProfile.phone || ""}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.phone && <p className={styles.error}>{errors.phone}</p>}
        </div>

        {/* EMAIL */}
        <div className={styles.group}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={localProfile.email || ""}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        {/* SUBMIT */}
        <div className={styles.actions}>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
