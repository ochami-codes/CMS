import { useState } from "react";

import Card from "../Card";
import Button from "../Button";
import Loader from "../Loader";
import ResponsiveDataView from "../ResponsiveDataView";
import ErrorState from "../ErrorState";

import useTreasuryFundsSummary from "../../hooks/treasury/useTreasuryFundSummary";
import useSabbathSchoolAttendance from "../../hooks/SabbathSchool/useSabbathSchoolAttendance";
import useSabbathSchoolFinances from "../../hooks/SabbathSchool/useSabbathSchoolFinances";

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
          message="Failed to load finances."
          onRetry={refresh}
        />
      </Card>
    );
  }

  return (
    <section className={styles.page}>
      {/* Current Balance */}
      <Card>
        <h3>Department Balance</h3>
        <strong className={styles.balance}>
          {formatCurrency(summary.departmentBalance)}
        </strong>
        <p className={styles.helpText}>
          Current available balance for the Sabbath School department.
        </p>
      </Card>

      {/* Record Offering */}
      <Card>
        <h3>Record Sabbath Offering</h3>
        <p className={styles.helpText}>
          Select the attendance session for which these offerings were collected.
        </p>

        <label>
          <span>Attendance Session</span>
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
          <p className={styles.info}>
            No attendance sessions are available. Record attendance first, then
            return here to record the offering.
          </p>
        )}

        <label>
          <span>Adults (Optional)</span>
          <input
            type="number"
            min="0"
            value={form.adults}
            onChange={(e) => handleChange("adults", e.target.value)}
          />
        </label>

        <label>
          <span>Youth (Optional)</span>
          <input
            type="number"
            min="0"
            value={form.youth}
            onChange={(e) => handleChange("youth", e.target.value)}
          />
        </label>

        <label>
          <span>Children (Optional)</span>
          <input
            type="number"
            min="0"
            value={form.children}
            onChange={(e) => handleChange("children", e.target.value)}
          />
        </label>

        <label>
          <span>Total Offering</span>
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
          <p className={styles.emptyState}>
            No offerings have been recorded yet.
          </p>
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
