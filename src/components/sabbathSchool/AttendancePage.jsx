import { useState } from "react";

import Card from "../Card";
import Button from "../Button";
import Loader from "../Loader";
import ErrorState from "../ErrorState";
import ResponsiveDataView from "../ResponsiveDataView";
import useSabbathSchoolAttendance from "../../hooks/SabbathSchool/useSabbathSchoolAttendance";
import { formatDate } from "../../utils/formatDate";

import styles from "../../styles/components/SabbathSchoolAttendancePage.module.css";

const defaultAttendance = {
  memberCount: 0,
  youthCount: 0,
  childCount: 0,
};

export default function AttendancePage({ departmentId }) {
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [form, setForm] = useState(defaultAttendance);

  const {
    attendance,
    loading,
    saving,
    saveAttendance,
    isError,
    refresh,
  } = useSabbathSchoolAttendance({ departmentId });

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: Number(value) || 0,
    }));
  };

  const handleSubmit = async () => {
    await saveAttendance({
      attendanceDate,
      ...form,
    });
    setForm(defaultAttendance);
  };

  if (loading) {
    return (
      <Card className={styles.loading}>
        <Loader message="Loading attendance..." fullScreen={false} />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className={styles.loading}>
        <ErrorState
          message="Failed to load attendance records."
          onRetry={refresh}
        />
      </Card>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.grid}>
        {/* Add Attendance Form */}
        <Card>
          <h3>Add Attendance</h3>
          <p className={styles.subtitle}>
            Enter the attendance for a Sabbath and save the record.
          </p>

          <label>
            <span>Attendance Date</span>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className={styles.date}
            />
            <small className={styles.helpText}>Format: mm/dd/yyyy</small>
          </label>

          <label>
            <span>Members Present</span>
            <input
              type="number"
              min="0"
              placeholder="e.g. 42"
              value={form.memberCount}
              onChange={(e) => handleChange("memberCount", e.target.value)}
            />
          </label>

          <label>
            <span>Youth Present</span>
            <input
              type="number"
              min="0"
              placeholder="e.g. 18"
              value={form.youthCount}
              onChange={(e) => handleChange("youthCount", e.target.value)}
            />
          </label>

          <label>
            <span>Children Present</span>
            <input
              type="number"
              min="0"
              placeholder="e.g. 31"
              value={form.childCount}
              onChange={(e) => handleChange("childCount", e.target.value)}
            />
          </label>

          <div className={styles.actions}>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Save Attendance"}
            </Button>
          </div>
        </Card>

        {/* Attendance History */}
        <Card>
          <h3>Attendance History</h3>
          {attendance.length === 0 ? (
            <p className={styles.emptyState}>
              No attendance has been recorded yet.
            </p>
          ) : (
            <ResponsiveDataView
              columns={[
                {
                  key: "attendanceDate",
                  label: "Date",
                  render: (value) =>
                    formatDate(value, { month: "long" }),
                },
                { key: "memberCount", label: "Members" },
                { key: "youthCount", label: "Youth" },
                { key: "childCount", label: "Children" },
                { key: "recordedBy", label: "Recorded By" },
              ]}
              data={attendance}
            />
          )}
        </Card>
      </div>
    </section>
  );
}
