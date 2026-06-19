import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";

import Card from "../../components/Card";
import Button from "../../components/Button";
import ResponsiveDataView from "../../components/ResponsiveDataView";

import styles from "../../styles/pages/MemberGivingTab.module.css";

export default function MemberGivingTab({
  members = [],
}) {
  const [query, setQuery] = useState("");

  /* ---------------- FILTERED DATA ---------------- */
  const filtered = useMemo(() => {
    if (!query) return members;

    return members.filter((m) =>
      m.full_name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, members]);

  /* ---------------- SUMMARY ---------------- */
  const summary = useMemo(() => {
    const totalMembers = members.length;

    const active = members.filter(
      (m) => m.total_tithe > 0
    ).length;

    const totalGiving = members.reduce(
      (sum, m) => sum + (m.total_tithe || 0) + (m.total_offering || 0),
      0
    );

    const avg = totalMembers
      ? totalGiving / totalMembers
      : 0;

    return {
      totalMembers,
      active,
      totalGiving,
      avg,
    };
  }, [members]);

  /* ---------------- TABLE CONFIG ---------------- */
  const columns = [
    { key: "full_name", label: "Member" },
    { key: "total_tithe", label: "Tithe" },
    { key: "total_offering", label: "Offering" },
    { key: "last_contribution", label: "Last Given" },
    { key: "status", label: "Status" },
  ];

  return (
    <section className={styles.container}>

      {/* SUMMARY CARDS */}
      <div className={styles.summaryGrid}>
        <Card>
          <h3>Total Members</h3>
          <p>{summary.totalMembers}</p>
        </Card>

        <Card>
          <h3>Active Givers</h3>
          <p>{summary.active}</p>
        </Card>

        <Card>
          <h3>Total Giving</h3>
          <p>KES {summary.totalGiving.toLocaleString()}</p>
        </Card>

        <Card>
          <h3>Avg per Member</h3>
          <p>KES {summary.avg.toFixed(0)}</p>
        </Card>
      </div>

      {/* FILTERS */}
      <div className={styles.actionsBar}>

        <div className={styles.searchBox}>
          <Search size={16} />
          <input
            placeholder="Search member..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <Button variant="secondary">
          <Download size={16} />
          Export PDF
        </Button>

      </div>

      {/* TABLE (RESPONSIVE CORE) */}
      <Card>
        <ResponsiveDataView
          columns={columns}
          data={filtered}
          renderActions={(row) => (
            <Button size="sm">
              View
            </Button>
          )}
        />
      </Card>

    </section>
  );
}