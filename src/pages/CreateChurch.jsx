import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";
import { AuthAPI, ChurchAPI } from "../utils/api";

import styles from "../styles/pages/CreateChurch.module.css";

export default function CreateChurch() {
  const navigate = useNavigate();

  const { refetchUser } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    churchName: "",
    conferenceId: "",
  });

  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const sanitizeChurchBaseName = (value) =>
    value
      .replace(/\b(sda|church|seventh day adventist)\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();

  useEffect(() => {
    const loadConferences = async () => {
      try {
        const res = await AuthAPI.getConferences();
        setConferences(res?.conferences || []);
      } catch {
        setConferences([]);
      }
    };

    loadConferences();
  }, []);

  const handleChange = (e) => {
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const cleanedName = sanitizeChurchBaseName(form.churchName);

    if (!cleanedName) {
      return setErrors({ churchName: "Church name is required" });
    }

    if (!form.conferenceId) {
      return setErrors({ conferenceId: "Select a conference" });
    }

    setLoading(true);

    try {
      await ChurchAPI.createChurch({
        church_name: cleanedName,
        conference_id: form.conferenceId,
      });

      showToast("Church created successfully 🎉", "success");

      await refetchUser();
      navigate("/dashboard");
    } catch (err) {
      setErrors({
        global: err?.message || "Failed to create church",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>

      <PageHeader
        title="Create Church"
        subtitle="Set up a new church workspace"
      />

      <Card className={styles.card}>

        {errors.global && (
          <p className={styles.errorGlobal}>
            {errors.global}
          </p>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>

          <Input
            label="Church Name"
            name="churchName"
            value={form.churchName}
            onChange={handleChange}
            placeholder="Maai Mahiu"
            error={errors.churchName}
          />

          <small className={styles.helperText}>
            “SDA Church” will be added automatically
          </small>

          <div className={styles.group}>

            <label className={styles.label}>
              Conference
            </label>

            <select
              name="conferenceId"
              value={form.conferenceId}
              onChange={handleChange}
              className={
                errors.conferenceId
                  ? styles.inputError
                  : styles.select
              }
            >
              <option value="">
                Select conference
              </option>

              {conferences.map((conf) => (
                <option key={conf.id} value={conf.id}>
                  {conf.name}
                </option>
              ))}
            </select>

            {errors.conferenceId && (
              <p className={styles.errorText}>
                {errors.conferenceId}
              </p>
            )}

          </div>

          <Button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading
              ? "Creating church..."
              : "Create Church"}
          </Button>

        </form>

      </Card>

    </div>
  );
}
