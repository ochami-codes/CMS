import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";
import { AuthAPI, ChurchAPI } from "../utils/api";

export default function CreateChurch() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    churchName: "",
    conferenceId: "",
  });
 
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { refetchUser } = useAuth();
  const { showToast } = useToast();
  /* -------------------------
     Helpers (STRICT)
  ------------------------- */

  const sanitizeChurchBaseName = (value) =>
    value
      .replace(/\b(sda|church|seventh day adventist)\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();

  /* -------------------------
     Load Conferences
  ------------------------- */
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

  /* -------------------------
     Handle input
  ------------------------- */
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors({});
  };

  /* -------------------------
     Submit
  ------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const cleanedName = sanitizeChurchBaseName(form.churchName);

    if (!cleanedName) {
      return setErrors({
        churchName: "Church name is required",
      });
    }

    if (!form.conferenceId) {
      return setErrors({
        conferenceId: "Select a conference",
      });
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
    <div className="auth-container">
      <div className="auth-card">

        <h2>Create Church</h2>

        {errors.global && (
          <p className="text-error text-sm text-center">
            {errors.global}
          </p>
        )}

        <form onSubmit={handleSubmit} className="form-stack">

          {/* Church Name */}
          <Input
            label="Church Name"
            name="churchName"
            value={form.churchName}
            onChange={handleChange}
            placeholder="Maai Mahiu"
            error={errors.churchName}
          />

          <small style={{ color: "#6b7280" }}>
            “SDA Church” will be added automatically
          </small>

          {/* Conference */}
          <div className="form-group">
            <label>Conference</label>

            <select
              name="conferenceId"
              value={form.conferenceId}
              onChange={handleChange}
              className={errors.conferenceId ? "input-error" : ""}
            >
              <option value="">Select conference</option>

              {conferences.map((conf) => (
                <option key={conf.id} value={conf.id}>
                  {conf.name}
                </option>
              ))}
            </select>

            {errors.conferenceId && (
              <p className="error-text">{errors.conferenceId}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Creating church..." : "Create Church"}
          </Button>

        </form>
      </div>
    </div>
  );
}
