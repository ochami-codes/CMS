import { useState } from "react";

import { memberFields } from "../../utils/memberFields";

import Button from "../../components/Button";
import Card from "../../components/Card";

import useAddMember from "../../hooks/clerk/useAddMember";

import styles from "../../styles/components/AddMember.module.css";

const fields = memberFields.members.fields;

const initialState = Object.fromEntries(
  fields.map((field) => [field.name, ""])
);

export default function AddMember() {
  const [formData, setFormData] =
    useState(initialState);

  const {
    addMember,
    loading,
  } = useAddMember();

  const updateField = (name, value) =>
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addMember(formData);

    setFormData(initialState);
  };

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Add Member
        </h2>

        <p className={styles.subtitle}>
          Enter the member's details below.
        </p>
      </div>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        {fields.map((field) => (
          <div
            key={field.name}
            className={styles.fieldGroup}
          >
            <label className={styles.label}>
              {field.label}
            </label>

            {field.type === "select" ? (
              <select
                className={styles.selectField}
                value={formData[field.name]}
                onChange={(e) =>
                  updateField(
                    field.name,
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select
                </option>

                {field.options?.map(
                  ({
                    label,
                    value,
                  }) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  )
                )}
              </select>
            ) : (
              <input
                className={styles.input}
                type={
                  field.type ?? "text"
                }
                value={
                  formData[field.name]
                }
                onChange={(e) =>
                  updateField(
                    field.name,
                    e.target.value
                  )
                }
              />
            )}
          </div>
        ))}

        <div className={styles.submitBtn}>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Add Member"}
          </Button>
        </div>
      </form>
    </Card>
  );
}