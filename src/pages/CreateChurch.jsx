import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import ErrorState from "../components/ErrorState";

import { useAuth } from "../context/AuthContext";
import useConferences from "../hooks/conferences/useConferences";
import useCreateChurch from "../hooks/churches/useCreateChurch";
import BackButton from "../components/BackButton";
import styles from "../styles/pages/CreateChurch.module.css";

export default function CreateChurch() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const [form, setForm] = useState({
    churchName: "",
    conferenceId: "",
  });

  const [errors, setErrors] = useState({});

  /* -------------------------
     Fetch Conferences
  ------------------------- */
  const {
    data: conferences = [],
    loadingConference,
    isError,
    error
  } = useConferences();

  /* -------------------------
     Create Church
  ------------------------- */
  const {
    mutateAsync: createChurch,
    loadingCreate,
  } = useCreateChurch();

  const loading = loadingConference || loadingCreate;

  /* -------------------------
     Sanitize Church Name
  ------------------------- */
  const sanitizeChurchBaseName = (value) =>
    value
      .replace(/\b(sda|church|seventh day adventist)\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();

  /* -------------------------
     Handle Input Change
  ------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  /* -------------------------
     Handle Submit
  ------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const cleanedName = sanitizeChurchBaseName(form.churchName);
    const newErrors = {};

    if (!cleanedName) {
      newErrors.churchName = "Church name is required";
    }
    if (!form.conferenceId) {
      newErrors.conferenceId = "Select a conference";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

      await createChurch({
        churchName: cleanedName,
        conferenceId: form.conferenceId,
      });

      await refetchUser?.();
      navigate("/dashboard");
    } 

  /* -------------------------
     Render
  ------------------------- */
  if (isError) {
    return <ErrorState
  error={error}
  title="Failed to load data"
  message={error?.message}
/>
  };

  return (
    <div className={styles.container}>
      <BackButton/>
      <PageHeader
        title="Create Church"
        subtitle="Set up a new church workspace"
      />

      <Card className={styles.card}>
        {errors.global && (
          <p className={styles.errorGlobal}>{errors.global}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className={styles.form}
          noValidate
        >
          <Input
            label="Church Name"
            name="churchName"
            value={form.churchName}
            onChange={handleChange}
            placeholder="Maai Mahiu"
            error={errors.churchName}
            disabled={loading}
          />

          <small className={styles.helperText}>
            “SDA Church” will be added automatically
          </small>

          <div className={styles.group}>
            <label htmlFor="conferenceId" className={styles.label}>
              Conference
            </label>

            <select
              id="conferenceId"
              name="conferenceId"
              value={form.conferenceId}
              onChange={handleChange}
              className={
                errors.conferenceId ? styles.inputError : styles.select
              }
              disabled={loading}
            >
              <option value="">Select conference</option>
              {conferences.map((conf) => (
                <option key={conf.id} value={conf.id}>
                  {conf.name}
                </option>
              ))}
            </select>

            {errors.conferenceId && (
              <p className={styles.errorText}>{errors.conferenceId}</p>
            )}
          </div>

          <Button
            type="submit"
            loading={loadingCreate}
            className={styles.submitBtn}
          >
            {loadingCreate ? "Creating church..." : "Create Church"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

