import { useState } from "react";
import {
  Building2,
  Power,
  PowerOff,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import Card from "../Card";
import Button from "../Button";

import useDepartments from "../../hooks/departments/useDepartment";
import useDepartmentActions from "../../hooks/departments/useDepartmentActions";

import styles from "../../styles/admin/DepartmentList.module.css";

export default function DepartmentList() {
  const { departments, loading, isFetching, isError, error, refresh } = useDepartments();
  const { activateDepartment, deactivateDepartment, activatingId, deactivatingId } = useDepartmentActions();

  const [systemOpen, setSystemOpen] = useState(true);
  const [customOpen, setCustomOpen] = useState(true);

  const handleToggleStatus = async (department) => {
    if (department.is_system) return;
    if (department.is_active) {
      await deactivateDepartment(department.id);
    } else {
      await activateDepartment(department.id);
    }
  };

  const systemDepartments = departments.filter((d) => d.is_system);
  const customDepartments = departments.filter((d) => !d.is_system);

  if (loading) {
    return (
      <Card title="Departments" icon={<Building2 size={18} />}>
        <p className={styles.muted}>Loading departments...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card title="Departments" icon={<Building2 size={18} />}>
        <div className={styles.error}>
          <p>{error?.message || "Unable to load departments."}</p>
          <Button size="sm" onClick={refresh}>Try Again</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Church Departments"
      subtitle="Manage the departments available within your church."
      icon={<Building2 size={18} />}
    >
      <div className={styles.header}>
        <div>
          <h3>Departments</h3>
          <p className={styles.muted}>
            System departments are managed by the church system. Custom departments can be activated or deactivated.
          </p>
        </div>
      </div>

      {isFetching && <p className={styles.refreshing}>Refreshing departments...</p>}

      {!departments.length ? (
        <div className={styles.empty}>
          <Building2 size={32} />
          <p>No departments found.</p>
        </div>
      ) : (
        <div className={styles.sections}>
          {/* SYSTEM DEPARTMENTS */}
          <section className={styles.section}>
            <button
              type="button"
              className={styles.sectionHeader}
              onClick={() => setSystemOpen((prev) => !prev)}
              aria-expanded={systemOpen}
            >
              <div className={styles.sectionTitle}>
                {systemOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                <div>
                  <h4>System Departments</h4>
                  <span className={styles.sectionCount}>
                    {systemDepartments.length} department{systemDepartments.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </button>

            {systemOpen && (
              <div className={styles.list}>
                {!systemDepartments.length ? (
                  <p className={styles.sectionEmpty}>No system departments found.</p>
                ) : (
                  systemDepartments.map((department) => (
                    <div key={department.id} className={styles.item}>
                      <div className={styles.info}>
                        <h4>{department.name}</h4>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>

          {/* CUSTOM DEPARTMENTS */}
          <section className={styles.section}>
            <button
              type="button"
              className={styles.sectionHeader}
              onClick={() => setCustomOpen((prev) => !prev)}
              aria-expanded={customOpen}
            >
              <div className={styles.sectionTitle}>
                {customOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                <div>
                  <h4>Custom Departments</h4>
                  <span className={styles.sectionCount}>
                    {customDepartments.length} department{customDepartments.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </button>

            {customOpen && (
              <div className={styles.list}>
                {!customDepartments.length ? (
                  <p className={styles.sectionEmpty}>No custom departments found.</p>
                ) : (
                  customDepartments.map((department) => {
                    const isActivating = activatingId === department.id;
                    const isDeactivating = deactivatingId === department.id;

                    return (
                      <div
                        key={department.id}
                        className={`${styles.item} ${!department.is_active ? styles.inactive : ""}`}
                      >
                        <div className={styles.info}>
                          <div className={styles.titleRow}>
                            <h4>{department.name}</h4>
                            <span className={styles.customBadge}>Custom</span>
                          </div>
                        </div>

                        <div className={styles.actions}>
                          <Button
                            size="sm"
                            variant={department.is_active ? "danger" : "success"}
                            loading={department.is_active ? isDeactivating : isActivating}
                            onClick={() => handleToggleStatus(department)}
                          >
                            {department.is_active ? (
                              <>
                                <PowerOff size={15} /> Deactivate
                              </>
                            ) : (
                              <>
                                <Power size={15} /> Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </Card>
  );
}
