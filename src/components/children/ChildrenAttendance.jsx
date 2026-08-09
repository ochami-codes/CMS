// src/pages/admin/ChildrenAttendance.jsx

import { useEffect, useState } from "react";

import Card from "../Card";
import Button from "../Button";
import Loader from "../Loader";
import ResponsiveDataView from "../ResponsiveDataView";
import ErrorState from "../ErrorState";
import useAttendance from "../../hooks/attendance/useAttendance";
import TextDisplay from "../TextDisplay";
import styles from "../../styles/components/ChildrenAttendance.module.css";

export default function ChildrenAttendance({ departmentId, children = [], loading }) {
  const [attendanceDate, setAttendanceDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [attendance, setAttendance] = useState([]);

  const {
    lastSabbath,
    loading: attendanceLoading,
    isError,
    error,
    refresh,
    saving,
    saveAttendance,
  } = useAttendance({
    departmentId,
    attendanceDate,
  });

  const hasAttendance = attendance.some((child) => child.present);

  useEffect(() => {
    setAttendance((current) =>
      children.map((child) => {
        const existing = current.find((item) => item.id === child.id);
        return {
          ...child,
          present: existing?.present ?? false,
        };
      })
    );
  }, [children]);

  const toggleAttendance = (id) => {
    setAttendance((current) =>
      current.map((child) =>
        child.id === id ? { ...child, present: !child.present } : child
      )
    );
  };

  const handleSave = async () => {
    await saveAttendance({
      attendanceDate,
      attendance: attendance.map(({ id, present }) => ({
        childId: id,
        present,
      })),
    });
  };

  const columns = [
    { key: "full_name", label: "Name" },
    { key: "parent_name", label: "Parent" },
    {
      key: "present",
      label: "Present",
      render: (child) => (
        <input
          type="checkbox"
          checked={child.present}
          onChange={() => toggleAttendance(child.id)}
        />
      ),
    },
  ];

  const historyColumns = [
    { key: "full_name", label: "Name" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className={styles.wrapper}>
      {/* Record Attendance */}
      <Card>
        <header className={styles.header}>
          <div>
            <TextDisplay
              as="h2"
              size="xl"
              weight="bold"
              color="primary"
            >
              Record Attendance
            </TextDisplay>
            <TextDisplay as="p" size="md" color="muted">
              Mark attendance for each registered child.
            </TextDisplay>
          </div>

          <input
            type="date"
            value={attendanceDate}
            className={styles.date}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </header>

        {loading ? (
          <Loader message="Loading children..." fullScreen={false} />
        ) : (
          <ResponsiveDataView columns={columns} data={attendance} />
        )}

        <footer className={styles.actions}>
          <Button
            disabled={loading || saving || !hasAttendance}
            onClick={handleSave}
          >
            {saving ? "Saving attendance..." : "Save Attendance"}
          </Button>
        </footer>
      </Card>

      {/* Last Sabbath Attendance */}
      <Card>
        <header className={styles.header}>
          <div>
            <TextDisplay
              as="h2"
              size="xl"
              weight="bold"
              color="primary"
            >
              Last Sabbath Attendance
            </TextDisplay>
            <TextDisplay as="p" size="md" color="muted">
              Review the previous attendance register.
            </TextDisplay>
          </div>
        </header>

        {attendanceLoading ? (
          <Loader message="Loading attendance..." fullScreen={false} />
        ) : isError ? (
          <ErrorState
            title="Unable to load attendance"
            message={error?.message ?? "We couldn't load attendance records."}
            onRetry={refresh}
          />
        ) : lastSabbath.length > 0 ? (
          <ResponsiveDataView columns={historyColumns} data={lastSabbath} />
        ) : (
          <div className={styles.empty}>
            <TextDisplay as="p" size="md" color="muted">
              No attendance records available.
            </TextDisplay>
            <TextDisplay as="small" size="sm" color="muted">
              Once attendance has been recorded, the previous Sabbath's register will appear here.
            </TextDisplay>
          </div>
        )}
      </Card>
    </div>
  );
}
