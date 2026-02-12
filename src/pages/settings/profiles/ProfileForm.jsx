import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Toast from "../../../components/Toast";
import "../../../styles/pages.css";
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
    setLocalProfile((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!localProfile.fullName?.trim()) newErrors.fullName = "Full name is required.";
    if (!localProfile.phone?.trim()) newErrors.phone = "Phone number is required.";
    if (!localProfile.email?.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(localProfile.email))
      newErrors.email = "Invalid email format.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onUpdate(localProfile);
  };

  return (
    <div className="card">
      {toast && (
        <Toast
          message={toast.text}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="form-stack">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={localProfile.fullName}
            onChange={handleChange}
            className="input-field"
          />
          {errors.fullName && <p className="message-error">{errors.fullName}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={localProfile.phone}
            onChange={handleChange}
            className="input-field"
          />
          {errors.phone && <p className="message-error">{errors.phone}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={localProfile.email}
            onChange={handleChange}
            className="input-field"
          />
          {errors.email && <p className="message-error">{errors.email}</p>}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
