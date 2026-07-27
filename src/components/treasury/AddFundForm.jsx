import { useState } from "react";

import Card from "../Card";
import Button from "../Button";
import ErrorState from "../ErrorState";

import useDepartments from "../../hooks/useDepartment";
import useCreateFund from "../../hooks/treasury/useCreateFund";

import styles from "../../styles/components/AddFundForm.module.css";

export default function AddFundForm({
  onSuccess,
  onCancel,
}) {
  const {
    departments,
    loading: departmentsLoading,
    isError: departmentsError,
    error: departmentsErrorDetails,
    refresh,
  } = useDepartments();

  const {
    createFund,
    creating,
  } = useCreateFund();

  const [form, setForm] = useState({
    name: "",
    department_id: "",
  });

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createFund({
      name: form.name,
      department_id:
        form.department_id || null,
    });

    onSuccess?.();
  };

  if (departmentsError) {
    return (
      <Card className={styles.card}>
        <ErrorState
          title="Unable to load departments"
          message={
            departmentsErrorDetails?.message ??
            "Failed to load departments."
          }
          onRetry={refresh}
        />
      </Card>
    );
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

            {departments.map(
              (department) => (
                <option
                  key={department.id}
                  value={department.id}
                >
                  {department.name}
                </option>
              )
            )}
          </select>

          <span className={styles.help}>
            Leave this empty if the fund belongs
            to the whole church.
          </span>
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={creating}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={creating}
          >
            Create Fund
          </Button>
        </div>
      </form>
    </Card>
  );
}
