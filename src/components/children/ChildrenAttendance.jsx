import { useEffect, useState } from "react";

import Card from "../Card";
import Button from "../Button";
import Loader from "../Loader";
import ResponsiveDataView from "../ResponsiveDataView";

import useAttendance from "../../hooks/attendance/useAttendance";

import styles from "../../styles/components/ChildrenAttendance.module.css";

export default function ChildrenAttendance({
  departmentId,
  children = [],
  loading,
}) {
  const [attendanceDate, setattendanceDate] =
    useState(() =>
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [attendance, setAttendance] =
    useState([]);

  const {
    lastSabbath,
    loading: attendanceLoading,
    saving,
    saveAttendance,
  } = useAttendance({
    departmentId,
    attendanceDate,
  });
  console.log("lastabbath", lastSabbath);
  const hasAttendance =
  attendance.some(
    (child) => child.present
  );

  useEffect(() => {
  setAttendance((current) =>
    children.map((child) => {
      const existing = current.find(
        (item) => item.id === child.id
      );

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
        child.id === id
          ? {
              ...child,
              present: !child.present,
            }
          : child
      )
    );
  };

  const handleSave = async () => {
    await saveAttendance({
      attendanceDate,
      attendance: attendance.map(
        ({ id, present }) => ({
          childId: id,
          present,
        })
      ),
    });
  };

  const columns = [
    {
      key: "full_name",
      label: "Name",
    },
    {
      key: "parent_name",
      label: "Parent",
    },
    {
      key: "present",
      label: "Present",
      render: (child) => (
        <input
          type="checkbox"
          checked={child.present}
          onChange={() =>
            toggleAttendance(child.id)
          }
        />
      ),
    },
  ];

  const historyColumns = [
    {
      key: "full_name",
      label: "Name",
    },
    {
      key: "status",
      label: "Status",
    },
  ];

  return (
    <div className={styles.wrapper}>
      <Card>
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>
              Record Attendance
            </h2>

            <p className={styles.subtitle}>
              Mark attendance for each
              registered child.
            </p>
          </div>

          <input
            type="date"
            value={attendanceDate}
            className={styles.date}
            onChange={(e) =>
              setattendanceDate(
                e.target.value
              )
            }
          />
        </header>

        {loading ? (
          <Loader
            message="Loading children..."
            fullScreen={false}
          />
        ) : (
          <ResponsiveDataView
            columns={columns}
            data={attendance}
          />
        )}

        <footer className={styles.actions}>
  <Button
    disabled={
      loading ||
      saving ||
      !hasAttendance
    }
    onClick={handleSave}
  >
    {saving
      ? "Saving attendance..."
      : "Save Attendance"}
  </Button>
</footer>
      </Card>

      <Card>
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>
              Last Sabbath Attendance
            </h2>

            <p className={styles.subtitle}>
              Review the previous
              attendance register.
            </p>
          </div>
        </header>

        {attendanceLoading ? (
          <Loader
            message="Loading attendance..."
            fullScreen={false}
          />
        ) : lastSabbath.length > 0 ? (
          <ResponsiveDataView
            columns={historyColumns}
            data={lastSabbath}
          />
        ) : (
          <div className={styles.empty}>
            <p>
              No attendance records
              available.
            </p>

            <small>
              Once attendance has been
              recorded, the previous
              Sabbath's register will
              appear here.
            </small>
          </div>
        )}
      </Card>
    </div>
  );
}