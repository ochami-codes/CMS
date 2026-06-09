import { useEffect, useState } from "react";

import Modal from "../Modal";
import Button from "../Button";
import styles from "../../styles/components/EditMemberModal.module.css";

export default function EditMemberModal({
  open,
  member,
  loading = false,
  onClose,
  onSave,
}) {
  const [formData, setFormData] =
    useState({});

  useEffect(() => {
    if (!member) return;

    setFormData({
      full_name:
        member.full_name || "",

      phone:
        member.phone || "",

      email:
        member.email || "",

      marital_status:
        member.marital_status || "",

      status:
        member.status || "active",

      membership_type:
        member.membership_type || "",

      baptized:
        member.baptized ?? false,

      baptismal_date:
        member.baptismal_date
          ?.split("T")[0] || "",

      joined_at:
        member.joined_at
          ?.split("T")[0] || "",

      emergency_contact_name:
        member.emergency_contact_name ||
        "",

      emergency_contact_phone:
        member.emergency_contact_phone ||
        "",

      emergency_contact_relationship:
        member.emergency_contact_relationship ||
        "",

      notes:
        member.notes || "",
    });
  }, [member]);

  const updateField = (
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave?.({
      memberId: member.id,
      payload: formData,
    });
  };

  if (!open || !member) {
    return null;
  }

  return (
    <Modal
      open={open}
      title="Edit Member Details"
      onClose={onClose}
    >
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        {/* BASIC INFORMATION */}

        <div className={styles.section}>
          <h3>
            Basic Information
          </h3>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>
                Full Name
              </label>

              <input
                type="text"
                value={
                  formData.full_name
                }
                onChange={(e) =>
                  updateField(
                    "full_name",
                    e.target.value
                  )
                }
                placeholder="Enter member's full name"
              />
            </div>

            <div className={styles.field}>
              <label>
                Phone Number
              </label>

              <input
                type="tel"
                value={
                  formData.phone
                }
                onChange={(e) =>
                  updateField(
                    "phone",
                    e.target.value
                  )
                }
                placeholder="e.g. 0712345678"
              />
            </div>

            <div className={styles.field}>
              <label>
                Email Address
              </label>

              <input
                type="email"
                value={
                  formData.email
                }
                onChange={(e) =>
                  updateField(
                    "email",
                    e.target.value
                  )
                }
                placeholder="e.g. member@email.com"
              />
            </div>

            <div className={styles.field}>
              <label>
                Marital Status
              </label>

              <select
                value={
                  formData.marital_status
                }
                onChange={(e) =>
                  updateField(
                    "marital_status",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select marital status
                </option>

                <option value="single">
                  Single
                </option>

                <option value="married">
                  Married
                </option>

                <option value="widowed">
                  Widowed
                </option>

                <option value="divorced">
                  Divorced
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* CHURCH DETAILS */}

        <div className={styles.section}>
          <h3>
            Church Information
          </h3>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>
                Membership Status
              </label>

              <select
                value={
                  formData.status
                }
                onChange={(e) =>
                  updateField(
                    "status",
                    e.target.value
                  )
                }
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>

                <option value="transferred">
                  Transferred
                </option>

                <option value="missing">
                  Missing
                </option>
              </select>
            </div>

            <div className={styles.field}>
              <label>
                Membership Type
              </label>

              <select
                value={
                  formData.membership_type
                }
                onChange={(e) =>
                  updateField(
                    "membership_type",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select membership type
                </option>

                <option value="baptized">
                  Baptized Member
                </option>

                <option value="profession_of_faith">
                  Profession of Faith
                </option>

                <option value="transfer">
                  Transfer Member
                </option>
              </select>
            </div>

            <div className={styles.field}>
              <label>
                Baptized?
              </label>

              <select
                value={
                  formData.baptized
                    ? "yes"
                    : "no"
                }
                onChange={(e) =>
                  updateField(
                    "baptized",
                    e.target.value ===
                      "yes"
                  )
                }
              >
                <option value="yes">
                  Yes
                </option>

                <option value="no">
                  No
                </option>
              </select>
            </div>

            <div className={styles.field}>
              <label>
                Baptism Date
              </label>

              <input
                type="date"
                value={
                  formData.baptismal_date
                }
                onChange={(e) =>
                  updateField(
                    "baptismal_date",
                    e.target.value
                  )
                }
              />
            </div>

            <div className={styles.field}>
              <label>
                Date Joined Church
              </label>

              <input
                type="date"
                value={
                  formData.joined_at
                }
                onChange={(e) =>
                  updateField(
                    "joined_at",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* EMERGENCY CONTACT */}

        <div className={styles.section}>
          <h3>
            Emergency Contact
          </h3>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>
                Contact Name
              </label>

              <input
                type="text"
                value={
                  formData.emergency_contact_name
                }
                onChange={(e) =>
                  updateField(
                    "emergency_contact_name",
                    e.target.value
                  )
                }
                placeholder="Name of relative or friend"
              />
            </div>

            <div className={styles.field}>
              <label>
                Contact Phone
              </label>

              <input
                type="tel"
                value={
                  formData.emergency_contact_phone
                }
                onChange={(e) =>
                  updateField(
                    "emergency_contact_phone",
                    e.target.value
                  )
                }
                placeholder="e.g. 0712345678"
              />
            </div>

            <div className={styles.field}>
              <label>
                Relationship
              </label>

              <input
                type="text"
                value={
                  formData.emergency_contact_relationship
                }
                onChange={(e) =>
                  updateField(
                    "emergency_contact_relationship",
                    e.target.value
                  )
                }
                placeholder="e.g. Spouse, Parent, Sibling"
              />
            </div>
          </div>
        </div>

        {/* NOTES */}

        <div className={styles.section}>
          <h3>Notes</h3>

          <textarea
            rows={4}
            value={formData.notes}
            onChange={(e) =>
              updateField(
                "notes",
                e.target.value
              )
            }
            placeholder="Additional member notes, remarks or special information..."
          />
        </div>

        {/* ACTIONS */}

        <div className={styles.actions}>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}