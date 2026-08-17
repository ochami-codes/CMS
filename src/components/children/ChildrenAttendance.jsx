// src/pages/admin/ChildrenAttendance.jsx

import { useEffect, useState } from "react";

import Card from "../Card";
import Button from "../Button";
import Loader from "../Loader";
import ResponsiveDataView from "../ResponsiveDataView";
import ErrorState from "../ErrorState";
import TextDisplay from "../TextDisplay";

import useAttendance from "../../hooks/attendance/useAttendance";

import styles from "../../styles/components/ChildrenAttendance.module.css";

export default function ChildrenAttendance({
  departmentId,
  children = [],
  loading,
}) {
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

  /*
   * Initialize the attendance register whenever
   * the children list changes.
   */
  useEffect(() => {
    setAttendance(
      children.map((child) => ({
        ...child,
        status: "absent",
        remarks: "",
      }))
    );
  }, [children]);

  const toggleAttendance = (childId) => {
    setAttendance((current) =>
      current.map((child) => {
        if (child.id !== childId) {
          return child;
        }

        return {
          ...child,
          status:
            child.status === "present"
              ? "absent"
              : "present",
        };
      })
    );
  };
  const updateRemarks = (childId, remarks) => {
    setAttendance((current) =>
      current.map((child) =>
        child.id === childId
          ? {
              ...child,
              remarks,
            }
          : child
      )
    );
  };
  const handleSave = async () => {
    await saveAttendance({
      attendanceDate,

      records: attendance.map((child) => ({
        memberId: null,
        childId: child.id,
        status: child.status,
        remarks: child.remarks?.trim() || null,
      })),
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
    key: "status",
    label: "Present",
    render: (status, child) => (
      <input
        type="checkbox"
        checked={status === "present"}
        onChange={() => toggleAttendance(child.id)}
      />
    ),
  },

  {
    key: "remarks",
    label: "Remarks",
    render: (remarks, child) => (
      <input
        type="text"
        value={remarks ?? ""}
        placeholder="Optional"
        onChange={(event) =>
          updateRemarks(child.id, event.target.value)
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

    {
      key: "remarks",
      label: "Remarks",
    },
  ];

  const hasChildren = attendance.length > 0;

  return (
    <div className={styles.container}>
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

            <TextDisplay
              as="p"
              size="md"
              color="muted"
            >
              Mark attendance for each registered child.
            </TextDisplay>
          </div>

          <input
            type="date"
            value={attendanceDate}
            className={styles.date}
            onChange={(event) =>
              setAttendanceDate(event.target.value)
            }
          />
        </header>

        {loading ? (
          <Loader
            message="Loading children..."
            fullScreen={false}
          />
        ) : attendance.length === 0 ? (
          <div className={styles.empty}>
            <TextDisplay
              as="p"
              size="md"
              color="muted"
            >
              No registered children found.
            </TextDisplay>
          </div>
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
              !hasChildren
            }
            onClick={handleSave}
          >
            {saving
              ? "Saving attendance..."
              : "Save Attendance"}
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
              Previous Attendance
            </TextDisplay>

            <TextDisplay
              as="p"
              size="md"
              color="muted"
            >
              Review the previous attendance register.
            </TextDisplay>
          </div>
        </header>

        {attendanceLoading ? (
          <Loader
            message="Loading attendance..."
            fullScreen={false}
          />
        ) : isError ? (
          <ErrorState
  error={error}
  title="Failed to load data"
  message={error?.message}
  onRetry={refresh}
/>
        ) : lastSabbath.length > 0 ? (
          <ResponsiveDataView
            columns={historyColumns}
            data={lastSabbath}
          />
        ) : (
          <div className={styles.empty}>
            <TextDisplay
              as="p"
              size="md"
              color="muted"
            >
              No attendance records available.
            </TextDisplay>

            <TextDisplay
              as="p"
              size="sm"
              color="muted"
            >
              Once attendance has been recorded, the
              previous Sabbath's register will appear here.
            </TextDisplay>
          </div>
        )}
      </Card>
    </div>
  );
}