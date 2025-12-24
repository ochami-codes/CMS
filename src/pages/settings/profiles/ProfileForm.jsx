// src/pages/settings/profileForm.jsx
import React, { useState } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

const ProfileForm = ({ fullName, phone, email, onUpdate, loading, message }) => {
  const [localFullName, setLocalFullName] = useState(fullName);
  const [localPhone, setLocalPhone] = useState(phone);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(localFullName, localPhone, email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Full Name"
        type="text"
        name="fullName"
        value={localFullName}
        onChange={(e) => setLocalFullName(e.target.value)}
        placeholder="Your full name"
      />
      <Input
        label="Phone Number"
        type="text"
        name="phone"
        value={localPhone}
        onChange={(e) => setLocalPhone(e.target.value)}
        placeholder="Your phone number"
      />
      <Input
        label="Email Address"
        type="email"
        name="email"
        value={email}
        disabled
        placeholder="example@example.com"
      />
      {message && (
        <p
          style={{
            marginBottom: "1rem",
            color: message.includes("successfully") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
};

export default ProfileForm;
