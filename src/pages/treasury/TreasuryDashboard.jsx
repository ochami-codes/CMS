// src/pages/admin/TreasuryDashboard.jsx

import { useState } from "react";
import { Landmark, LayoutDashboard, Receipt, Users } from "lucide-react";

import Loader from "../../components/Loader";
import RequirePermission from "../../components/RequirePermission";
import Tabs from "../../components/Tabs";
import Button from "../../components/Button";
import ErrorState from "../../components/ErrorState";
import TextDisplay from "../../components/TextDisplay";
import { useTreasuryDashboard } from "../../hooks/treasury/useTreasuryDashboard";
import { useMembers } from "../../hooks/clerk/useMembers";

import TreasuryOverview from "./TreasuryOverview";
import TransactionsTab from "./TransactionsTab";
import MemberGivingTab from "./MemberGivingTab";
import FundsTab from "./FundsTab";
import BackButton from "../../components/BackButton";
import styles from "../../styles/pages/TreasuryDashboard.module.css";

const tabs = [
  { key: "overview", label: "Overview", Icon: LayoutDashboard },
  { key: "transactions", label: "Transactions", Icon: Receipt },
  { key: "members", label: "Members", Icon: Users },
  { key: "funds", label: "Funds", Icon: Landmark },
];

export default function TreasuryDashboard() {
  const {
    data,
    loading: treasuryLoading,
    isError: treasuryError,
    error,
    refresh,
    isFetching,
  } = useTreasuryDashboard();

  const {
    members,
    loading: membersLoading,
    isError: membersError,
    error: membersErrorDetails,
  } = useMembers();

  const [activeTab, setActiveTab] = useState("overview");

  /* -------------------------
     LOADING STATE
  -------------------------- */
  if (treasuryLoading || membersLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <Loader message="Loading treasury data..." fullScreen />
      </div>
    );
  }

  /* -------------------------
     ERROR STATE
  -------------------------- */
  if (treasuryError || membersError) {
    return (
      <div className={styles.loadingWrapper}>
        <ErrorState
          title="Failed to load treasury dashboard"
          error={error}
          message={
            error?.message ||
            membersErrorDetails?.message ||
            "Something went wrong while fetching data."
          }
          onRetry={refresh}
        />
      </div>
    );
  }

  /* -------------------------
     MAIN VIEW
  -------------------------- */
  return (
    <RequirePermission permission="access_treasury_dashboard">
      <BackButton/>
      <main className={`page-container ${styles.page}`}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <TextDisplay
              as="h1"
              size="2xl"
              weight="bold"
              color="primary"
            >
              Treasury Management
            </TextDisplay>
            <TextDisplay
              as="p"
              size="md"
              color="muted"
            >
              Manage church finances, member giving, fund balances, transactions, and treasury
              reporting.
            </TextDisplay>
          </div>
        </header>

        {/* Tabs */}
        <Tabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />

        {/* Content */}
        <section className={styles.content}>
          <div className={styles.tabPanel}>
            {activeTab === "overview" && (
              <TreasuryOverview overview={data.overview} isFetching={isFetching} />
            )}

            {activeTab === "transactions" && (
              <TransactionsTab onTransactionAdded={refresh} />
            )}

            {activeTab === "members" && <MemberGivingTab members={members} />}

            {activeTab === "funds" && <FundsTab />}
          </div>
        </section>
      </main>
    </RequirePermission>
  );
}
