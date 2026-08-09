import { useState } from "react";

import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import Button from "../components/Button";
import EncouragementRedirect from "../components/EncouragementRedirect";
import TextDisplay from "../components/TextDisplay";

import { useRegister } from "../hooks/auth/useRegister";

import {
  validateRegistration,
  validateRegistrationField,
  createRegistrationPayload,
} from "../utils/validators/registerValidation";

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
  const [currentStep, setCurrentStep] = useState(0);
  const [registered, setRegistered] = useState(false);

  const {
    mutate: register,
    isPending,
  } = useRegister();

  /* -------------------------
     Registration Fields
  ------------------------- */

  const fields = [
    "fullName",
    "email",
    "phone",
    "dateOfBirth",
    "gender",
    "password",
    "confirmPassword",
  ];

  const currentField = fields[currentStep];

  const isLastStep =
    currentStep === fields.length - 1;

  /* -------------------------
     Handle Input Change
  ------------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...form,
      [name]: value,
    };

    setForm(updatedForm);

    const error = validateRegistrationField(
      name,
      value,
      updatedForm
    );

    setErrors((prev) => ({
      ...prev,
      [name]: error || "",
      global: "",
    }));
  };

  /* -------------------------
     Move to Next Field
  ------------------------- */

  const handleNext = () => {
    const error = validateRegistrationField(
      currentField,
      form[currentField],
      form
    );

    /* Don't continue if current field
       is invalid */
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [currentField]: error,
      }));

      return;
    }

    /* Clear current field error */
    setErrors((prev) => ({
      ...prev,
      [currentField]: "",
      global: "",
    }));

    /* Move to next field */
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  /* -------------------------
     Handle Enter Key
  ------------------------- */

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!isLastStep) {
        handleNext();
      }
    }
  };

  /* -------------------------
     Go Back
  ------------------------- */

  const handleBack = () => {
    if (currentStep === 0) {
      return;
    }

    setErrors((prev) => ({
      ...prev,
      global: "",
    }));

    setCurrentStep((prev) => prev - 1);
  };

  /* -------------------------
     Handle Registration
  ------------------------- */

  const handleRegister = (e) => {
    e.preventDefault();

    setErrors({});

    /* Validate entire form before
       sending to backend */
    const validationErrors =
      validateRegistration(form);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);

      /*
       * Find the first field that
       * contains an error.
       */
      const firstErrorField =
        fields.find(
          (field) =>
            validationErrors[field]
        );

      if (firstErrorField) {
        const errorIndex =
          fields.indexOf(firstErrorField);

        setCurrentStep(errorIndex);
      }

      return;
    }

    /* Create API payload */
    const payload =
      createRegistrationPayload(form);

    /* Execute registration */
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
        delay={15000}
      />
    );
  }

  /* -------------------------
     Render Current Field
  ------------------------- */

  const renderCurrentField = () => {
    switch (currentField) {
      case "fullName":
        return (
          <Input
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            error={errors.fullName}
            autoFocus
          />
        );

      case "email":
        return (
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            error={errors.email}
            autoFocus
          />
        );

      case "phone":
        return (
          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="07XXXXXXXX"
            error={errors.phone}
            autoFocus
          />
        );

      case "dateOfBirth":
        return (
          <Input
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            error={errors.dateOfBirth}
            autoFocus
          />
        );

      case "gender":
        return (
          <div className={styles.selectGroup}>
            <label>Gender</label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoFocus
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
        );

      case "password":
        return (
          <PasswordInput
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            showStrength
            error={errors.password}
            required
            autoFocus
          />
        );

      case "confirmPassword":
        return (
          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            error={errors.confirmPassword}
            required
            autoFocus
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          Create Account
        </h2>

        {/* Progress */}
        <div className={styles.progress}>
          Step {currentStep + 1} of{" "}
          {fields.length}
        </div>

        {/* Global Error */}
        {errors.global && (
          <TextDisplay
            as="p"
            size="sm"
            color="danger"
          >
            {errors.global}
          </TextDisplay>
        )}

        <form
          onSubmit={
            isLastStep
              ? handleRegister
              : (e) => {
                  e.preventDefault();
                  handleNext();
                }
          }
          className={styles.form}
        >
          {/* Current Field */}
          {renderCurrentField()}

          {/* Navigation */}
          <div className={styles.navigation}>
            {currentStep > 0 && (
              <Button
                type="button"
                onClick={handleBack}
                disabled={isPending}
              >
                Back
              </Button>
            )}

            {!isLastStep && (
              <Button
                type="submit"
                className="btn-primary"
              >
                Continue
              </Button>
            )}

            {isLastStep && (
              <Button
                type="submit"
                loading={isPending}
                className="btn-primary"
              >
                {isPending
                  ? "Creating account…"
                  : "Register"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
