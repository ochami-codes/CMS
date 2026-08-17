import { useState } from "react";
import { Building2 } from "lucide-react";

import PageHeader from "../PageHeader";
import Card from "../Card";
import Button from "../Button";
import Loader from "../Loader";
import EmptyState from "../EmptyState";
import ErrorState from "../ErrorState";

import DepartmentList from "./DepartmentList";
import DepartmentForm from "./DepartmentForm";

import useDepartments from "../../hooks/departments/useDepartment";
import useDepartmentActions  from "../../hooks/departments/useDepartmentActions";

import styles from "../../styles/admin/ManageDepartments.module.css";

export default function ManageDepartments() {
  const [showForm, setShowForm] =
    useState(false);

  const {
    departments,
    loading,
    isError,
    error,
    refresh,
  } = useDepartments();

  const {
    processingId,
    activateDepartment,
    deactivateDepartment,
  } = useDepartmentActions();


  /* -------------------------
     Toggle Department
  ------------------------- */

  const handleToggle = async (
    department
  ) => {
    if (department.is_active) {
      await deactivateDepartment(
        department.id
      );
    } else {
      await activateDepartment(
        department.id
      );
    }
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title="Departments"
        subtitle="Manage church departments and ministries."
        icon={<Building2 size={20} />}
        actions={
          <Button
            onClick={() =>
              setShowForm(true)
            }
          >
            Add Department
          </Button>
        }
      />

      <Card>
        {loading && (
          <Loader
            fullScreen={false}
            message="Loading departments..."
          />
        )}

        {!loading && isError && (
         <ErrorState
  error={error}
  title="Failed to load data"
  message={error?.message}
  onRetry={refresh}
/>
        )}

        {!loading &&
          !isError &&
          departments.length === 0 && (
            <EmptyState
              title="No departments"
              description="Create your first department."
            />
          )}

        {!loading &&
          !isError &&
          departments.length > 0 && (
            <DepartmentList
              departments={
                departments
              }
              processingId={
                processingId
              }
              onToggle={
                handleToggle
              }
            />
          )}
      </Card>
{showForm && (
      <DepartmentForm
        open={ () => setShowForm(true)}
        onClose={() =>
          setShowForm(false)
        }
      />)}
    </div>
  );
}