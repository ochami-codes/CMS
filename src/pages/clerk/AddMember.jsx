import { useState } from "react";

import { memberFields } from "../../utils/memberFields";
import {
  validateMemberField,
  validateMember,
} from "../../utils/validators/memberValidator";

import Button from "../../components/Button";
import Card from "../../components/Card";
import TextDisplay from "../../components/TextDisplay";
import useAddMember from "../../hooks/clerk/useAddMember";

import styles from "../../styles/components/AddMember.module.css";

const fields =
  memberFields.members.fields;

const initialState =
  Object.fromEntries(
    fields.map((field) => [
      field.name,
      "",
    ])
  );

export default function AddMember() {
  const [formData, setFormData] =
    useState(initialState);

  const [errors, setErrors] =
    useState({});

  const {
    addMember,
    loading,
  } = useAddMember();

  /* -------------------------
     Update Field
  ------------------------- */

  const updateField = (
    name,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error =
      validateMemberField(
        name,
        value
      );

    setErrors((prev) => ({
      ...prev,
      [name]: error || "",
    }));
  };

  /* -------------------------
     Submit
  ------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Button fired");

    const validationErrors =
      validateMember(formData);

    setErrors(validationErrors);

    if (
      Object.keys(
        validationErrors
      ).length > 0
    ) {
      return;
    }

    await addMember(formData);

    setFormData(initialState);
    setErrors({});
  };

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <TextDisplay
          as="h2"
          size="xl"
          weight="bold"
          color="primary"
        >
          Add Member
        </TextDisplay>

        <TextDisplay as="p" size="md" color="muted">
          Enter the member's details below.
        </TextDisplay>
      </div>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
      >
        {fields.map((field) => (
          <div
            key={field.name}
            className={
              styles.fieldGroup
            }
          >
            <label
              className={styles.label}
            >
              {field.label}
              {field.required && (
                <TextDisplay as="span" size="sm" weight="bold" color="danger">
                  *
                </TextDisplay>
              )}
            </label>

            {field.type ===
            "select" ? (
              <select
                className={
                  styles.selectField
                }
                value={
                  formData[
                    field.name
                  ] ?? ""
                }
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
                className={
                  styles.input
                }
                type={
                  field.type ??
                  "text"
                }
                value={
                  formData[
                    field.name
                  ] ?? ""
                }
                onChange={(e) =>
                  updateField(
                    field.name,
                    e.target.value
                  )
                }
              />
            )}

            {errors[
              field.name
            ] && (
              <TextDisplay as="p" size="sm" color="danger">
                
                {
                  errors[
                    field.name
                  ]
                }
              </TextDisplay>
            )}
          </div>
        ))}

        <div
          className={
            styles.submitBtn
          }
        >
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