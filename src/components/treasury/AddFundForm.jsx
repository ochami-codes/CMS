import { useState } from "react";
import toast from "react-hot-toast";

import Card from "../Card";
import Button from "../Button";

import { TreasuryAPI } from "../../utils/api";
import useDepartments from "../../hooks/useDepartment";

import styles from "../../styles/components/AddFundForm.module.css";

export default function AddFundForm({
  onSuccess,
  onCancel,
}) {
  const {
    departments,
    loading: departmentsLoading,
  } = useDepartments();
console.log(departments);
  const [form, setForm] = useState({
    name: "",
    department_id: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      await TreasuryAPI.createFund({
        name: form.name,
        department_id: form.department_id || null,
      });

      toast.success("Fund created successfully.");
      onSuccess?.();
    } catch (error) {
      toast.error(
        error.message || "Failed to create fund."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className={styles.card}>
      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <div>
          <h2 className={styles.title}>
            Create Fund
          </h2>

          <p className={styles.subtitle}>
            Add a new fund for the church or a
            specific department.
          </p>
        </div>

        <div className={styles.field}>
          <label htmlFor="name">
            Fund Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Youth Camp Fund"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="department_id">
            Department (Optional)
          </label>

          <select
            id="department_id"
            name="department_id"
            value={form.department_id}
            onChange={handleChange}
            disabled={departmentsLoading}
          >
            <option value="">
              General Church Fund
            </option>

            {departments.map((department) => (
              <option
                key={department.id}
                value={department.id}
              >
                {department.name}
              </option>
            ))}
          </select>

          <span className={styles.help}>
            Leave this empty if the fund belongs to
            the whole church.
          </span>
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Fund"}
          </Button>
        </div>
      </form>
    </Card>
  );
}