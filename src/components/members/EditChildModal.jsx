import { useEffect, useState } from "react";
import Modal from "../Modal";
import Button from "../Button";
import styles from "../../styles/components/EditChildModal.module.css";

const initialState = {
  full_name: "",
  date_of_birth: "",
  gender: "",
  status: "active",
  dedication: "unknown",
  dedication_date: "",
  notes: "",
};

export default function EditChildModal({ open, child, onClose, onSave, loading }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (child) {
      setForm({
        full_name: child.full_name ?? "",
        date_of_birth: child.date_of_birth ?? "",
        gender: child.gender ?? "",
        dedication: child.dedication ?? "unknown",
        dedication_date: child.dedication_date ?? "",
        notes: child.notes ?? "",
      });
    }
  }, [child]);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({ childId: child.id, payload: form });
    onClose();
  };

  if (!open || !child) return null;

  return (
    <Modal open={open} onClose={onClose} title="Edit Child Record">
      <form className={styles.form} onSubmit={handleSubmit}>
        
        {/* Header */}
        <div className={styles.banner}>
          Editing: <strong>{child.full_name}</strong>
        </div>

        {/* Full Name */}
        <div className={styles.field}>
          <label>Full Name</label>
          <input
            type="text"
            value={form.full_name}
            onChange={(e) => update("full_name", e.target.value)}
            placeholder="e.g. John Mutua"
            required
          />
        </div>

        {/* DOB + Gender */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Date of Birth</label>
            <input
              type="date"
              value={form.date_of_birth}
              onChange={(e) => update("date_of_birth", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Gender</label>
            <select
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="male">Boy</option>
              <option value="female">Girl</option>
            </select>
          </div>
        </div>

        {/* Dedication */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Dedication Status</label>
            <select
              value={form.dedication}
              onChange={(e) => update("dedication", e.target.value)}
            >
              <option value="unknown">Unknown</option>
              <option value="dedicated">Dedicated</option>
              <option value="not_dedicated">Not Dedicated</option>
            </select>
          </div>
          {form.dedication === "dedicated" && (
            <div className={styles.field}>
              <label>Dedication Date</label>
              <input
                type="date"
                value={form.dedication_date}
                onChange={(e) => update("dedication_date", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Notes */}
        <div className={styles.field}>
          <label>Notes (Optional)</label>
          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Any important child information (health, guardianship notes, etc.)"
          />
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
