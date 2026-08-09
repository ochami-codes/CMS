import { useState } from "react";
import { Building2 } from "lucide-react";

import Button from "../Button";
import Input from "../Input";
import Modal from "../Modal";
import useDepartmentActions from "../../hooks/departments/useDepartmentActions";
import styles from "../../styles/admin/DepartmentForm.module.css";

export default function DepartmentForm({ open, onClose }) {
  const [form, setForm] = useState({ name: "" });
  const { createDepartment, isCreating } = useDepartmentActions();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();

    if (!name) {
      return;
    }

    try {
      await createDepartment({ name });
      setForm({ name: "" });
      onClose?.();
    } catch {
      // no need to handle here, the hook already shows toast on error
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Department" size="md">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.intro}>
          <Building2 size={20} />
          <div>
            <h3>Create a Custom Department</h3>
            <p>Add a department that fits the structure and ministry needs of your church.</p>
          </div>
        </div>

        <Input
          label="Department Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Digital Evangelism"
          required
        />

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button type="submit" loading={isCreating}>
            Create Department
          </Button>
        </div>
      </form>
    </Modal>
  );
}