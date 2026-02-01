import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Toast from "../../../components/Toast";

const ProfileForm = ({ profile, onUpdate, loading, message }) => {
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
    <>
      {toast && (
        <Toast
          message={toast.text}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={localProfile.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={localProfile.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={localProfile.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </>
  );
};

export default ProfileForm;
