import { useState } from "react";

import { ClerkAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

import Button from "../../components/Button";
import Card from "../../components/Card";

export default function AddMember({
  onMemberAdded,
}) {
  const { showToast } = useToast();

  const initialState = {
    // PROFILE
    full_name: "",
    phone: "",
    date_of_birth: "",
    gender: "",

    // MEMBER RECORD
    baptized: "unknown",
    baptismal_date: "",
    marital_status: "",
    membership_type: "",

    // EMERGENCY CONTACT
    emergency_contact_name: "",
    emergency_contact_relationship: "",
    emergency_contact_phone: "",
  };

  const [formData, setFormData] =
    useState(initialState);

  const [loading, setLoading] =
    useState(false);

  const updateField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        profile: {
          full_name: formData.full_name,
          phone: formData.phone,
          date_of_birth:
            formData.date_of_birth,
          gender: formData.gender,
        },

        member_record: {
          baptized: formData.baptized,
          baptismal_date:
            formData.baptismal_date,
          marital_status:
            formData.marital_status,
          membership_type:
            formData.membership_type,

          emergency_contact_name:
            formData.emergency_contact_name,
          emergency_contact_relationship:
            formData.emergency_contact_relationship,
          emergency_contact_phone:
            formData.emergency_contact_phone,
        },
      };

      const res =
        await ClerkAPI.addMember(
          payload
        );

      showToast(
        "Member registered successfully",
        "success"
      );

      onMemberAdded?.(res?.member);

      setFormData(initialState);
    } catch (err) {
      showToast(
        err.message ||
          "Failed to register member",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2>Register Member</h2>
      <p>
        Add a new church member to the system
      </p>

      <form onSubmit={handleSubmit}>
        {/* ================= PERSONAL INFO ================= */}
        <h3>Personal Information</h3>

        <input
          placeholder="Full Name"
          value={formData.full_name}
          onChange={(e) =>
            updateField(
              "full_name",
              e.target.value
            )
          }
          required
        />

        <input
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) =>
            updateField(
              "phone",
              e.target.value
            )
          }
          required
        />

        <input
          type="date"
          value={formData.date_of_birth}
          onChange={(e) =>
            updateField(
              "date_of_birth",
              e.target.value
            )
          }
        />

        <select
          value={formData.gender}
          onChange={(e) =>
            updateField(
              "gender",
              e.target.value
            )
          }
          required
        >
          <option value="">
            Select Gender
          </option>
          <option value="male">
            Male
          </option>
          <option value="female">
            Female
          </option>
        </select>

        {/* ================= CHURCH INFO ================= */}
<h3>Church Information</h3>

<select
  value={formData.baptized}
  onChange={(e) =>
    updateField("baptized", e.target.value)
  }
>
  <option>Baptism Status</option>
  <option value="unknown">
    Unknown
  </option>
  <option value="baptized">
    Baptized
  </option>
  <option value="not_baptized">
    Not Baptized
  </option>
</select>

{formData.baptized === "baptized" && (
  <input
    type="date"
    value={formData.baptismal_date}
    onChange={(e) =>
      updateField(
        "baptismal_date",
        e.target.value
      )
    }
  />
)}

<select
  value={formData.marital_status}
  onChange={(e) =>
    updateField(
      "marital_status",
      e.target.value
    )
  }
>
  <option value="">
    Marital Status
  </option>
  <option value="single">
    Single
  </option>
  <option value="married">
    Married
  </option>
  <option value="divorced">
    Divorced
  </option>
  <option value="widowed">
    Widowed
  </option>
</select>

<select
  value={formData.membership_type}
  onChange={(e) =>
    updateField(
      "membership_type",
      e.target.value
    )
  }
  required
>
  <option value="">
    Membership Type
  </option>
  <option value="birth">
    Birth
  </option>
  <option value="transfer-in">
    Transfer In
  </option>
  <option value="profession_of_faith">
    Profession of Faith
  </option>
  <option value="other">
    Other
  </option>
</select>
        {/* ================= EMERGENCY CONTACT ================= */}
        <h3>Emergency Contact</h3>

        <input
          placeholder="Name"
          value={
            formData.emergency_contact_name
          }
          onChange={(e) =>
            updateField(
              "emergency_contact_name",
              e.target.value
            )
          }
        />

        <input
          placeholder="Relationship"
          value={
            formData.emergency_contact_relationship
          }
          onChange={(e) =>
            updateField(
              "emergency_contact_relationship",
              e.target.value
            )
          }
        />

        <input
          placeholder="Phone"
          value={
            formData.emergency_contact_phone
          }
          onChange={(e) =>
            updateField(
              "emergency_contact_phone",
              e.target.value
            )
          }
        />

        {/* ================= SUBMIT ================= */}
        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Registering..."
            : "Register Member"}
        </Button>
      </form>
    </Card>
  );
}