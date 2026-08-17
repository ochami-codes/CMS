import { useState } from "react";

import Card from "../Card";
import Button from "../Button";
import Loader from "../Loader";
import ResponsiveDataView from "../ResponsiveDataView";
import ErrorState from "../ErrorState";

import useTreasuryFundsSummary from "../../hooks/treasury/useTreasuryFundSummary";
import useSabbathSchoolAttendance from "../../hooks/SabbathSchool/useSabbathSchoolAttendance";
import useSabbathSchoolFinances from "../../hooks/SabbathSchool/useSabbathSchoolFinances";
import TextDisplay from "../TextDisplay";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

import styles from "../../styles/components/SabbathSchoolFinancesPage.module.css";

const defaultOffering = {
  adults: 0,
  youth: 0,
  children: 0,
  total: 0,
};

export default function FinancesPage({ departmentId }) {
  const {
    summary,
    loading: summaryLoading,
    isError: summaryError,
    error,
    refresh,
  } = useTreasuryFundsSummary({
    departmentId,
    enabled: !!departmentId,
  });

  const { attendance, isError: attendanceError } = useSabbathSchoolAttendance({
    departmentId,
  });

  const {
    offerings,
    isError: financesError,
    loading,
    saving,
    saveOfferings,
  } = useSabbathSchoolFinances({ departmentId });

  const [sessionId, setSessionId] = useState("");
  const [form, setForm] = useState(defaultOffering);

  const handleChange = (field, value) => {
    const amount = Number(value) || 0;
    setForm((current) => {
      const updated = { ...current, [field]: amount };
      updated.total = updated.adults + updated.youth + updated.children;
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!sessionId) return;

    await saveOfferings({
      sessionId,
      groups: [
        { groupName: "Adults", offeringAmount: form.adults },
        { groupName: "Youth", offeringAmount: form.youth },
        { groupName: "Children", offeringAmount: form.children },
      ],
    });

    setForm(defaultOffering);
    setSessionId("");
  };

  if (summaryLoading || loading) {
    return (
      <Card className={styles.state}>
        <Loader message="Loading finances..." fullScreen={false} />
      </Card>
    );
  }

  if (summaryError || attendanceError || financesError) {
    return (
      <Card className={styles.state}>
       <ErrorState
  error={error}
  title="Failed to load data"
  message={error?.message}
  onRetry={refresh}
/>
      </Card>
    );
  }

  return (
    <section className={styles.page}>
      {/* Current Balance */}
      <Card>
        <TextDisplay as="h3">Department Balance</TextDisplay>
        <TextDisplay as="p" size="md" color="muted">
          <strong>
          {formatCurrency(summary.departmentBalance)}
        </strong>
          (Current available balance for the Sabbath School department.)
        </TextDisplay>
      </Card>

      {/* Record Offering */}
      <Card>
        <TextDisplay as="h3" size="md">Record Sabbath Offering</TextDisplay>
        <TextDisplay as="p" size="sm" color="muted">
          Select the attendance session for which these offerings were collected.
        </TextDisplay>

        <label>
          <TextDisplay as="span" color="muted">Attendance Session</TextDisplay>
          <select
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
          >
            <option value="">Select a Sabbath</option>
            {attendance.map((session) => (
              <option key={session.id} value={session.id}>
                {formatDate(session.attendanceDate, { month: "long" })}
              </option>
            ))}
          </select>
        </label>

        {attendance.length === 0 && (
          <TextDisplay as="p" size="sm" color="warning">
            No attendance sessions are available. Record attendance first, then
            return here to record the offering.
          </TextDisplay>
        )}

        <label>
          <TextDisplay as="span" size="sm" color="muted">Adults (Optional)</TextDisplay>
          <input
            type="number"
            min="0"
            value={form.adults}
            onChange={(e) => handleChange("adults", e.target.value)}
          />
        </label>

        <label>
          <TextDisplay as="span" size="sm" color="muted">Youth (Optional)</TextDisplay>
          <input
            type="number"
            min="0"
            value={form.youth}
            onChange={(e) => handleChange("youth", e.target.value)}
          />
        </label>

        <label>
          <TextDisplay as="span" size="sm" color="muted">Children (Optional)</TextDisplay>
          <input
            type="number"
            min="0"
            value={form.children}
            onChange={(e) => handleChange("children", e.target.value)}
          />
        </label>

        <label>
          <TextDisplay as="span" size="sm" color="muted">Total Offering</TextDisplay>
          <input readOnly value={form.total} />
        </label>

        <div className={styles.actions}>
          <Button onClick={handleSubmit} disabled={!sessionId || saving}>
            {saving ? "Saving..." : "Save Offering"}
          </Button>
        </div>
      </Card>

      {/* Recent Offerings */}
      <Card>
        <h3>Recent Offerings</h3>
        {offerings.length === 0 ? (
          <TextDisplay as="p" size="sm" color="warning">
            No offerings have been recorded yet.
          </TextDisplay>
        ) : (
          <ResponsiveDataView
            columns={[
              {
                key: "date",
                label: "Date",
                render: (value) => formatDate(value, { month: "long" }),
              },
              { key: "adults", label: "Adults" },
              { key: "youth", label: "Youth" },
              { key: "children", label: "Children" },
              { key: "total", label: "Total" },
              { key: "recordedBy", label: "Recorded By" },
            ]}
            data={offerings}
          />
        )}
      </Card>
    </section>
  );
}
