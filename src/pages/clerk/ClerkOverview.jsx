import { useState } from "react";
import {
  Users,
  UserCheck,
  ArrowLeftRight,
  UserX,
  FileText,
  Download,
} from "lucide-react";

import StatCard from "../../components/StatCard";
import Button from "../../components/Button";

import styles from "../../styles/pages/Clerk.module.css";

import { useClerkOverview } from "../../hooks/clerk/useClerkOverview";
import { useClerkActions } from "../../hooks/clerk/useClerkActions";

export default function ClerkOverview() {
  const { data, loading } = useClerkOverview();

  const {
    generateReport,
    downloadReport,
  } = useClerkActions();

  const [reportType, setReportType] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [quarter, setQuarter] = useState(1);

  const [reportLoading, setReportLoading] = useState(false);

  /* =========================
     GENERATE REPORT PREVIEW
  ========================== */
  const handleGenerateReport = async () => {
    try {
      setReportLoading(true);

      const params = {
        type: reportType,
        year,
      };

      if (reportType === "monthly") {
        params.month = month;
      }

      if (reportType === "quarterly") {
        params.quarter = quarter;
      }

      await generateReport(params);
    } finally {
      setReportLoading(false);
    }
  };

  /* =========================
     DOWNLOAD REPORT
  ========================== */
  const handleDownloadReport = async () => {
    try {
      setReportLoading(true);

      const params = {
        type: reportType,
        year,
      };

      if (reportType === "monthly") {
        params.month = month;
      }

      if (reportType === "quarterly") {
        params.quarter = quarter;
      }

      const filename = `church-report-${reportType}-${year}.pdf`;

      await downloadReport(params, filename);
    } finally {
      setReportLoading(false);
    }
  };

  if (loading) {
    return <p>Loading overview...</p>;
  }

  return (
    <div>
      <h2 className={styles.overviewTitle}>
        📊 Church Overview
      </h2>

      {/* =======================
          STATS
      ======================= */}
      <div className={styles.statsGrid}>
        <StatCard
          title="Total Members"
          value={data?.total_members || 0}
          icon={<Users size={20} />}
        />

        <StatCard
          title="Active Members"
          value={data?.active_members || 0}
          icon={<UserCheck size={20} />}
        />

        <StatCard
          title="Pending Transfers"
          value={data?.pending_transfers || 0}
          icon={<ArrowLeftRight size={20} />}
        />

        <StatCard
          title="Missing Members"
          value={data?.missing_members || 0}
          icon={<UserX size={20} />}
        />
      </div>

      {/* =======================
          REPORT GENERATOR
      ======================= */}
      <div className={styles.reportCard}>
        <h3 className={styles.sectionTitle}>
          <FileText size={18} />
          Reports & Downloads
        </h3>

        <div className={styles.reportGrid}>
          {/* Type */}
          <div>
            <label>Report Type</label>
            <select
              value={reportType}
              onChange={(e) =>
                setReportType(e.target.value)
              }
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Year */}
          <div>
            <label>Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) =>
                setYear(Number(e.target.value))
              }
            />
          </div>

          {/* Month */}
          {reportType === "monthly" && (
            <div>
              <label>Month</label>
              <select
                value={month}
                onChange={(e) =>
                  setMonth(Number(e.target.value))
                }
              >
                {[
                  "January","February","March","April",
                  "May","June","July","August",
                  "September","October","November","December",
                ].map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quarter */}
          {reportType === "quarterly" && (
            <div>
              <label>Quarter</label>
              <select
                value={quarter}
                onChange={(e) =>
                  setQuarter(Number(e.target.value))
                }
              >
                <option value={1}>Q1</option>
                <option value={2}>Q2</option>
                <option value={3}>Q3</option>
                <option value={4}>Q4</option>
              </select>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className={styles.reportActions}>
          <Button
            onClick={handleGenerateReport}
            disabled={reportLoading}
          >
            {reportLoading
              ? "Generating..."
              : "Preview Report"}
          </Button>

          <Button
            variant="secondary"
            onClick={handleDownloadReport}
            disabled={reportLoading}
          >
            <Download size={16} />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}