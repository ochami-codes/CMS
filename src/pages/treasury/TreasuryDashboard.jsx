import { useState } from "react";

import Loader from "../../components/Loader";
import RequirePermission from "../../components/RequirePermission";
import { useTreasuryDashboard } from "../../hooks/treasury/useTreasuryDashboard";
import Tabs from "../../components/Tabs";

import TreasuryOverview from "./TreasuryOverview";
import MemberGivingTab from "./MemberGivingTab";
import FundsTab from "./FundsTab";
import TransactionsTab from "./TransactionsTab";
import {
  Receipt,
  LayoutDashboard,
  Users,
  Landmark
} from "lucide-react";
import styles from "../../styles/pages/TreasuryDashboard.module.css";

export default function TreasuryDashboard() {
  const { data, loading, refresh } = useTreasuryDashboard();

  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <Loader message="Loading treasury data..." />
      </div>
    );
  }

  return (
    <RequirePermission permission="view_finances">
      <main className={`page-container ${styles.page}`}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              Treasury Management
            </h1>

            <p className={styles.subtitle}>
              Manage church finances, member giving, fund balances,
              transactions, and treasury reporting.
            </p>
          </div>
        </header>

<Tabs
  activeTab={activeTab}
  onChange={setActiveTab}
  tabs={[
    {
      key: "overview",
      label: "Overview",
      Icon: LayoutDashboard,
    },
    {
      key: "transactions",
      label: "Transactions",
      Icon: Receipt,
    },
    {
      key: "members",
      label: "Members",
      Icon: Users,
    },
    {
      key: "funds",
      label: "Funds",
      Icon: Landmark,
    },
  ]}
/>;

        <section className={styles.content}>
          <div className={styles.tabPanel}>
            {activeTab === "overview" && (
              <TreasuryOverview overview={data.overview} />
            )}

            {activeTab === "transactions" && (
              <TransactionsTab
                onTransactionAdded={refresh}
              />
            )}

            {activeTab === "members" && (
              <MemberGivingTab
                members={data.members}
              />
            )}

            {activeTab === "funds" && (
              <FundsTab
                groups={data.groups}
              />
            )}
          </div>
        </section>
      </main>
    </RequirePermission>
  );
}
